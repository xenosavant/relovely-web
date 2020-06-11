import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, NgZone, ChangeDetectorRef, Input } from '@angular/core';
import { FormControl, Validators, FormGroup, FormArray, FormBuilder, AbstractControl, ValidationErrors, FormArrayName } from '@angular/forms';
import { Category } from '@app/shared/models/category.model';
import { LookupService } from '@app/shared/services/lookup/lookup.service';
import { guid } from '../../utils/rand';
import { ImageSet } from '@app/shared/interfaces/image-set.interface';
import { forkJoin } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';
import { SizeFilterGroup } from '@app/shared/models/size-filter-group.model';
import { Product } from '@app/shared/models/product.model';
import { ProductService } from '@app/shared/services/product/product.service';
import { VideoMetaData } from '@app/shared/interfaces/video-meta-data';
import { switchMap, map, tap, concatMap } from 'rxjs/operators';
import { resolve } from 'dns';
import { ColorFilter } from '@app/shared/interfaces/color-filter.interface';
import { KeyValue } from '@app/shared/interfaces/key-value.interface';
import { FileUploadService } from '@app/shared/services/file-upload.service';
import { weights } from '../../../data/weights.ts';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCreateComponent implements OnInit {


  @Input() sellerId: string;
  @Input() product: Product;
  @Output() close: EventEmitter<any> = new EventEmitter;

  public imageChangedEvent: any = null;
  public crop = false;
  public form: FormGroup;
  public categories: Array<Category[]> = [];
  public video: VideoMetaData;
  public images: ImageSet[] = [];
  public rootCategories = [];
  public tags: string[] = [];
  public selectable = true;
  public removable = true;
  public id: string;
  public originalImage: string;
  public sizes: SizeFilterGroup[];
  public colors: ColorFilter[];
  public showSize = true;
  public imageError = false;
  public currentSizes: KeyValue[] = [];
  public videoThumbnail: string;
  public imageUploadError = false;
  public loading = false;
  public saveError = false;
  edit = false;
  title: string;
  cuurencyChars = new RegExp('[\.,$]', 'g');
  weights = weights;


  constructor(private formBuilder: FormBuilder,
    private uploadService: FileUploadService,
    private readonly zone: NgZone,
    private lookupService: LookupService,
    private ref: ChangeDetectorRef,
    private productService: ProductService) {

  }

  ngOnInit() {
    if (this.product) {
      this.edit = true;
      this.title = 'Edit Product';
      this.form = new FormGroup({
        title: new FormControl(this.product.title, [Validators.required]),
        description: new FormControl(this.product.description, [Validators.required]),
        brand: new FormControl(this.product.brand, [Validators.required]),
        categories: this.formBuilder.array(
          [
            this.formBuilder.group({
              id: this.product.categories[0]
            }),
            this.formBuilder.group({
              id: this.product.categories[1]
            }),
            this.formBuilder.group({
              id: this.product.categories[2]
            })
          ]
        ),
        size: new FormControl(this.product.sizeId),
        price: new FormControl(this.product.price, [Validators.required]),
        retailPrice: new FormControl(this.product.retailPrice),
        color: new FormControl(this.product.colorId),
        tag: new FormControl(''),
        weight: new FormControl(this.product.weight, [Validators.required])
      }, this.validateCategories);
      console.log(this.form)
      this.tags = [...this.product.tags];
      this.images = this.product.images;
      this.video = this.product.videos.length ? this.product.videos[0] : null;
    } else {
      this.title = 'List A Product';
      this.form = new FormGroup({
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        categories: new FormArray([
          this.formBuilder.group({
            id: null
          })]),
        brand: new FormControl('', [Validators.required]),
        size: new FormControl('', [Validators.required]),
        tag: new FormControl(''),
        price: new FormControl(null, [Validators.required]),
        retailPrice: new FormControl(null),
        color: new FormControl(null),
        weight: new FormControl(null, [Validators.required])
      }, this.validateCategories);
    }
    this.id = guid();
    this.form.get('categories').valueChanges.subscribe((val: any) => {
      this.setSizes(val);
    })
    this.lookupService.getState().then(state => {
      this.sizes = state.sizes;
      this.colors = state.colors;
      this.rootCategories = state.categories;
      this.categories.push(this.rootCategories);
      if (this.edit) {
        const second = this.categories[0].find(cat => cat.id === this.product.categories[0]);
        this.categories.push(second.children);
        const third = this.categories[1].find(cat => cat.id === this.product.categories[1]);
        this.categories.push(third.children);
        this.setSizes(this.form.get('categories').value);
      }
    })
  }

  setSizes(categories) {
    this.currentSizes = [];
    if (categories.length === 3 && categories[2].id) {
      this.sizes.forEach(size => {
        if (size.categoryIds.indexOf(categories[2].id) > -1) {
          size.filters.forEach(filter => {
            this.currentSizes.push(filter);
          });
        }
      });
      const formField = this.form.get('size');
      if (!this.currentSizes.length) {
        formField.clearValidators();
        formField.updateValueAndValidity();
      } else {
        formField.setValidators([Validators.required]);
        formField.updateValueAndValidity();
      }
    }
  }

  public selectCategory(category: any, index: any) {
    for (let i = this.categoryArray['controls'].length - 1; i > index; i--) {
      this.categoryArray.removeAt(i);
    }
    this.categories = this.categories.slice(0, index + 1);
    const valueAtIndex = this.categories[index].find(cat => cat.id === category.value);
    const targetIndex = this.categories[index].indexOf(valueAtIndex);
    if (this.categories[index][targetIndex].children.length) {
      this.categories.push(this.categories[index][targetIndex].children);
      this.categoryArray.push(this.formBuilder.group({
        id: null
      }))
    } else {

    }
  }

  get categoryArray() {
    return this.form.get('categories') as FormArray;
  }

  public imageChanged($event: any): void {
    this.imageChangedEvent = $event;
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.originalImage = fileReader.result as string;
    }
    fileReader.readAsDataURL($event.target.files[0]);
    this.crop = true;
  }

  onClose($event: any) {
    this.close.emit($event);
  }

  onCloseCropper($event: any) {
    this.crop = false;
  }

  videoUploaded($event: any) {
    this.video = $event;
    this.videoThumbnail = this.video.url.replace(this.video.format, 'jpg');
  }

  onRemoveVideo($event: any) {
    this.video = null;
  }

  onImageCropped(cropped: string) {
    this.uploadService.upload('data:image/jpeg;base64,' + cropped, `products/${this.id}/images`, 'image').pipe(
      concatMap(croppedResult => this.uploadService.upload('data:image/jpeg;base64,' + this.originalImage, `products/${this.id}/images`, 'image')
        .pipe(map((originalResult: any) => {
          this.images.push({ cropped: croppedResult.secure_url, original: originalResult.secure_url });
        })))).subscribe(result => {
          this.zone.run(() => {
            this.crop = false;
            this.imageUploadError = false;
            this.ref.detectChanges();
          });
        }, err => {
          this.imageUploadError = true;
          this.crop = false;
        });
  }

  onRemoveImage(url) {
    this.images.splice(this.images.indexOf(url), 1);
  }

  onKeyup(key: any) {
    if (key.key === ',' || key.key === 'Enter') {
      this.onAddTag();
    }
  }

  onAddTag() {
    const tag = this.form.get('tag').value;
    if (this.tags.indexOf(tag) < 0) {
      this.tags = this.tags.concat(tag);
    }
    this.form.get('tag').setValue('');
  }

  onRemoveTag(tag: string) {
    this.tags.splice(this.tags.indexOf(tag), 1);
  }

  public onSave() {
    if (!this.images.length) {
      this.imageError = true;
    } else {
      this.loading = true;
      this.images.forEach(image => {
        delete image.id;
      });
      console.log(+this.form.get('price').value);
      const product: Product = {
        cloudId: this.id,
        title: this.form.get('title').value,
        description: this.form.get('description').value,
        categories: this.categoryArray['controls'].map(c => c.value.id),
        images: this.images,
        videos: this.video ? [this.video] : [],
        brand: this.form.get('brand').value,
        tags: this.tags,
        price: this.form.get('price').value,
        weight: this.form.get('weight').value
      };
      if (this.form.get('size').value) {
        product.sizeId = this.form.get('size').value;
      }
      if (this.form.get('color').value) {
        product.colorId = this.form.get('color').value;
      }
      if (this.form.get('retailPrice').value) {
        product.retailPrice = this.form.get('retailPrice').value;
      }
      if (this.edit) {
        this.productService.patchProduct(product, this.product.id).subscribe(response => {
          this.loading = false;
          this.close.emit();
        }, error => {
          this.saveError = true;
        })
      } else {
        this.productService.postProduct(product, this.sellerId).subscribe(response => {
          this.loading = false;
          this.close.emit();
        }, error => {
          this.saveError = true;
        })
      }
    }

  }

  validateCategories(control: FormGroup): ValidationErrors {
    const cats = control.get('categories');
    let response: ValidationErrors = null;
    if (cats) {
      if (cats.value.length < 3) {
        response = { categories: 'Please select a category' }
      }
      if (!response) {
        cats.value.forEach(val => {
          if (!val.id) {
            response = { categories: 'Please select a category' }
          }
        });
      }
      return response;
    }
    return { categories: 'Please select a category' }
  }
}
