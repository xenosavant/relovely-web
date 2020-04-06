import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, NgZone, ChangeDetectorRef, Input } from '@angular/core';
import { FormControl, Validators, FormGroup, FormArray, FormBuilder, AbstractControl } from '@angular/forms';
import { Category } from '@app/shared/models/category.model';
import { LookupService } from '@app/shared/services/lookup/lookup.service';
import { KeyValue } from '../../../../shared/interfaces/key-value.interface';
import { guid } from '../../../../shared/utils/rand';
import { FileUploadService } from '../../../../shared/services/file-upload.service'
import { ImageSet } from '@app/shared/interfaces/image-set.interface';
import { forkJoin } from 'rxjs';
import { Video } from '@app/shared/interfaces/video';
import { ThrowStmt } from '@angular/compiler';
import { SizeFilterGroup } from '@app/shared/models/size-filter-group.model';
import { Product } from '@app/shared/models/product.model';
import { ProductService } from '@app/shared/services/product/product.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCreateComponent implements OnInit {


  @Input() sellerId: string;
  @Output() close: EventEmitter<any> = new EventEmitter;

  public imageChangedEvent: any = null;
  public crop = false;
  public form: FormGroup;
  public categories: Array<Category[]> = [];
  public video: Video;
  public images: ImageSet[] = [];
  public rootCategories = [];
  public tags: string[] = [];
  public selectable = true;
  public removable = true;
  public id: string;
  public originalImage: string;
  public sizes: SizeFilterGroup[];
  public showSize = true;
  public imageError = false;
  public currentSizes: KeyValue[] = [];


  constructor(private formBuilder: FormBuilder,
    private uploadService: FileUploadService,
    private readonly zone: NgZone,
    private lookupService: LookupService,
    private ref: ChangeDetectorRef,
    private productService: ProductService) {
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
      price: new FormControl(null, [Validators.required])
    });
    this.lookupService.getState().then(state => {
      this.rootCategories = state.categories;
      this.categories.push(state.categories);
    })
  }

  ngOnInit() {
    this.id = guid();
    this.form.get('categories').valueChanges.subscribe(val => {
      this.currentSizes = [];
      if (val.length === 3) {
        this.sizes.forEach(size => {
          if (size.categoryIds.indexOf(val[2].id) > -1) {
            size.filters.forEach(filter => {
              this.currentSizes.push(filter);
            })
          }
        });
        if (!this.currentSizes.length) {
          // remove size field;
          this.showSize = false;
          this.form.get('size').setValue({ size: new FormControl(''), });
        } else {
          if (!this.showSize) {
            this.form.get('size').setValue({ size: new FormControl('', [Validators.required]) });
            this.showSize = true;
          }
        }
      }
    })
    this.lookupService.getState().then(state => {
      this.sizes = state.sizes;
    })
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
      console.log(this.categories[index][targetIndex]);
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
    console.log(this.crop);
  }

  onClose($event: any) {
    this.close.emit($event);
  }

  onCloseCropper($event: any) {
    this.crop = false;
  }

  public videoUploaded($event: any) {
    this.video = $event;
  }

  onImageCropped(cropped: string) {
    forkJoin(this.uploadService.upload('data:image/jpeg;base64,' + cropped, `${this.id}/images`, 'image'),
      this.uploadService.upload('data:image/jpeg;base64,' + this.originalImage, `${this.id}/images`, 'image'))
      .subscribe(([cropped, original]) => {
        if (cropped.secure_url && original.secure_url) {
          this.images.push({ cropped: cropped.secure_url, original: original.secure_url });
        }
        this.zone.run(() => {
          this.crop = false;
          this.ref.detectChanges();
        });
      }, (err) => {
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
      this.imageError = false;
      let product: Product;
      const size = this.lookupService.getSize(this.form.get('size').value);
      console.log(this.form.get('size').value, size);
      product = {
        title: this.form.get('title').value,
        description: this.form.get('description').value,
        categories: this.categoryArray['controls'].map(c => c.value.id),
        images: this.images,
        videos: this.video ? [this.video] : [],
        size: size,
        sizeId: this.form.get('size').value,
        brand: this.form.get('brand').value,
        tags: this.tags,
        price: this.form.get('price').value * 100,
        auction: false,
        sold: false
      };
      console.log(product);
      this.productService.postProduct(product, this.sellerId).subscribe(response => {
        console.log(response);
      })
    }

  }

}
