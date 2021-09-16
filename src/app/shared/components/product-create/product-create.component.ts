import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, NgZone, ChangeDetectorRef, Input } from '@angular/core';
import { FormControl, Validators, FormGroup, FormArray, FormBuilder, AbstractControl, ValidationErrors, FormArrayName, ValidatorFn } from '@angular/forms';
import { Category } from '@app/shared/models/category.model';
import { LookupService } from '@app/shared/services/lookup/lookup.service';
import { guid } from '../../utils/rand';
import { ImageSet } from '@app/shared/interfaces/image-set.interface';
import { SizeFilterGroup } from '@app/shared/models/size-filter-group.model';
import { Product } from '@app/shared/models/product.model';
import { ProductService } from '@app/shared/services/product/product.service';
import { VideoMetaData } from '@app/shared/interfaces/video-meta-data';
import { map, concatMap } from 'rxjs/operators';
import { ColorFilter } from '@app/shared/interfaces/color-filter.interface';
import { KeyValue } from '@app/shared/interfaces/key-value.interface';
import { FileUploadService } from '@app/shared/services/file-upload.service';
import { weights } from '../../../data/weights';
import { BreakpointObserver } from '@angular/cdk/layout';
import { UserAuth } from '@app/shared/models/user-auth.model';
import { UserService } from '@app/shared/services/user/user.service';
import heic2any from "heic2any";
import { CategoriesPipe } from '@app/shared/pipes/categories.pipe';

const MAX_WIDTH = 800;

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCreateComponent implements OnInit {

  @Input() product: Product;
  @Input() type: 'item' | 'bundle';
  @Output() close: EventEmitter<boolean> = new EventEmitter;
  @Output() saved: EventEmitter<boolean> = new EventEmitter;
  public imageChangedEvent: any = null;
  public crop = false;
  public form: FormGroup;
  public categories: Array<Category[]> = [];
  public bundleCategories: Map<string, string[]> = new Map();
  public bundleSizes: string[] = [];
  public bundlePrices: { [id: string]: string[] } = {
    '3': ['3500', '5000', '7500', '10000'],
    '5': ['3500', '5000', '7500', '10000', '15000'],
    '10': ['3500', '5000', '7500', '10000', '15000', '20000']
  };
  public quantities = ['3', '5', '10'];
  public video: VideoMetaData;
  public images: ImageSet[] = [];
  public rootCategories: Category[] = [];
  public tags: string[] = [];
  public selectable = true;
  public removable = true;
  public id: string;
  public originalImage: string;
  public sizes: SizeFilterGroup[];
  public colors: ColorFilter[];
  public showSize = true;
  public imageError = false; x
  public categoryError = false;
  public sizeError = false;
  public currentSizes: KeyValue[] = [];
  public videoThumbnail: string;
  public imageUploadError = false;
  public loading = false;
  public saveError = false;
  edit = false;
  title: string;
  currencyChars = new RegExp('[\.,$]', 'g');
  weights = weights;
  mobile: boolean;
  sellerEarnings: number;
  earningsBreakdown: string;
  currentUser: UserAuth;


  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private uploadService: FileUploadService,
    private readonly zone: NgZone,
    private lookupService: LookupService,
    private ref: ChangeDetectorRef,
    private productService: ProductService,
    private breakpointObserver: BreakpointObserver,
    private categoriesPipe: CategoriesPipe) {
  }

  ngOnInit() {
    this.currentUser = this.userService.user$.getValue();
    this.breakpointObserver.observe(['(max-width: 500px)']).subscribe(result => {
      this.mobile = result.matches;
    });
    this.sizes = this.lookupService.state.sizes;
    this.setForm();
    if (this.edit && this.type === 'item') {
      const second = this.categories[0].find(cat => cat.id === this.product.categories[0]);
      this.categories.push(second.children);
      const third = this.categories[1].find(cat => cat.id === this.product.categories[1]);
      this.categories.push(third.children);
      this.setSizes(this.form.get('categories').value);
    }
    this.form.get('price').valueChanges.subscribe(value => {
      if (value) {
        this.calculateFees();
      }
    });
  }

  setForm() {
    switch (this.type) {
      case 'item':
        this.colors = this.lookupService.state.colors;
        if (this.product) {
          this.edit = true;
          this.title = 'Edit Product';
          if (this.product.videos.length) {
            this.video = this.product.videos[0];
            this.videoThumbnail = this.product.videos[0].url.replace(this.video.format, 'jpg');
          }
          this.id = this.product.cloudId;
          this.form = new FormGroup({
            title: new FormControl(this.product.title, [Validators.required]),
            description: new FormControl(this.product.description, [Validators.required]),
            brand: new FormControl(this.product.brand),
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
            price: new FormControl(this.product.price.toString(), [Validators.required, this.validatePrice]),
            retailPrice: new FormControl(this.product.retailPrice ? this.product.retailPrice.toString() : ''),
            color: new FormControl(this.product.colorId),
            tag: new FormControl(''),
            weight: new FormControl(this.product.weight, [Validators.required])
          }, this.validateCategories);
          this.tags = [...this.product.tags];
          this.images = [...this.product.images];
          this.video = this.product.videos.length ? this.product.videos[0] : null;
          this.setSizes(this.lookupService.getCategory(this.product.categories[0]));
          this.calculateFees();
        } else {
          this.title = 'List A Product';
          this.form = new FormGroup({
            title: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            categories: new FormArray([
              this.formBuilder.group({
                id: null
              })]),
            brand: new FormControl(''),
            size: new FormControl('', [Validators.required]),
            tag: new FormControl(''),
            price: new FormControl(null, [Validators.required, , this.validatePrice]),
            retailPrice: new FormControl(null),
            color: new FormControl(null),
            weight: new FormControl(null, [Validators.required])
          }, this.validateCategories);
          this.id = guid();
        }
        this.rootCategories = this.lookupService.state.categories;
        this.categories.push(this.rootCategories);
        break;
      case 'bundle':
        this.rootCategories = this.lookupService.state.categories;
        this.categories.push(this.rootCategories);
        if (this.product) {
          this.title = 'Edit Bundle';
          this.edit = true;
          this.id = this.product.cloudId;
          this.form = new FormGroup({
            description: new FormControl(this.product.description, [Validators.required]),
            category: new FormControl(this.product.categories.find(cat => cat.length === 1), [Validators.required]),
            categories: new FormArray([
              this.formBuilder.group({
                id: ''
              })]),
            size: new FormControl(''),
            weight: new FormControl(this.product.weight, [Validators.required]),
            price: new FormControl(this.product.price.toString(), [Validators.required]),
            quantity: new FormControl(this.product.quantity.toString(), [Validators.required]),
            tag: new FormControl(''),
          });
          this.bundleSizes = [...this.product.sizes];
          const catIds = this.product.categories.filter(id =>
            id.length === 4
          );
          catIds.forEach(id => {
            this.bundleCategories.set(id, this.lookupService.getParents(id).map(cat => cat.id))
          });
          this.tags = [...this.product.tags];
          this.images = [...this.product.images];
          this.selectTopLevel({ value: this.product.categories.find(cat => cat.length === 1) }, true);
          this.bundleCategories.forEach((value, key) => {
            const category = this.lookupService.getCategory(key);
            this.setSizesFromCategory(category);
          })
          this.calculateFees();
        } else {
          this.title = 'Create A Bundle';
          this.id = guid();
          this.form = new FormGroup({
            description: new FormControl('', [Validators.required]),
            category: new FormControl('', [Validators.required]),
            categories: new FormArray([]),
            size: new FormControl(''),
            weight: new FormControl('', [Validators.required]),
            price: new FormControl('', [Validators.required]),
            quantity: new FormControl('', [Validators.required]),
            tag: new FormControl(''),
          });
        }
        break;
    }
  }

  selectTopLevel(control, init = false) {
    const newIndex = this.rootCategories.findIndex(c => c.id === control.value);
    if (!init) {
      this.bundleCategories = new Map();
    }
    const length = this.categoryArray.length;
    for (let i = 0; i < length; i++) {
      this.categoryArray.removeAt(i);
    }
    this.categories = [this.rootCategories, this.rootCategories[newIndex].children]
    this.categoryArray.push(this.formBuilder.group({
      id: null
    }))
    this.currentSizes = [];
  }

  setSizes(category: Category) {
    this.setSizesFromCategory(category);
    if (this.type === 'item') {
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

  selectSize(selection) {
    if (this.bundleSizes.indexOf(selection.value) === -1) {
      this.bundleSizes.push(selection.value);
    }
  }

  selectCategory(selection: any, index: any) {
    if (this.type === 'bundle') {
      const rootIndex = parseInt(this.form.get('category').value) - 1;
      if (index === 1) {
        const parents = this.lookupService.getParents(selection.value)
        if (!this.bundleCategories.get(selection.value)) {
          this.bundleCategories.set(selection.value, parents.map(p => p.id));
        }
        for (let i = 0; i < 2; i++) {
          this.categoryArray.removeAt(i);
        }
        this.currentSizes = [];
        this.bundleCategories.forEach((value, key) => {
          const category = this.lookupService.getCategory(key);
          this.setSizes(category);
        })
      } else {
        const indexOfSelection = this.categories[0][rootIndex].children.findIndex(c => c.id === selection.value);
        this.categories = [this.rootCategories, this.rootCategories[rootIndex].children, this.rootCategories[rootIndex].children[indexOfSelection].children];
        this.categoryArray.removeAt(1);
        this.categoryArray.push(this.formBuilder.group({
          id: null
        }));
      }
    } else {
      for (let i = this.categoryArray['controls'].length - 1; i > index; i--) {
        this.categoryArray.removeAt(i);
      }
      this.categories = this.categories.slice(0, index + 1);
      const valueAtIndex = this.categories[index].find(cat => cat.id === selection.value);
      const targetIndex = this.categories[index].indexOf(valueAtIndex);
      if (this.categories[index][targetIndex].children.length) {
        this.categories.push(this.categories[index][targetIndex].children);
        this.categoryArray.push(this.formBuilder.group({
          id: null
        }))
      }
      if (index === 2) {
        this.currentSizes = [];
        this.setSizes(this.categories[index][targetIndex]);
      }
    }
  }

  getCategory(id) {
    return this.lookupService.getCategory(id).name;
  }

  onRemoveCategory(id) {
    this.bundleCategories.delete(id);
  }

  onRemoveSize(id) {
    this.bundleSizes.splice(this.sizes.indexOf(id, 1));
  }

  get categoryArray() {
    return this.form.get('categories') as FormArray;
  }

  public imageChanged($event: any): void {
    const context = this;
    context.originalImage = null;
    const file = $event.target.files[0];
    if (/(gif|jpe?g|tiff?|png|webp|bmp|heic|heif)/g.test(file.type)) {
      this.imageUploadError = false;
      var img = new Image();
      this.loading = true;
      img.onload = (event: any) => {
        const canvas = document.createElement("canvas");
        const image = event.target;
        if (image.width > MAX_WIDTH) {
          canvas.width = MAX_WIDTH;
          canvas.height = image.height * (MAX_WIDTH / image.width);
        } else {
          canvas.width = image.width;
          canvas.height = image.height;
        }
        const ctx = canvas.getContext("2d");
        const scaleFactor = canvas.width / image.width;
        ctx.drawImage(image, 0, 0, image.width * scaleFactor, image.height * scaleFactor);
        const dataURL = canvas.toDataURL('image/jpg');
        context.originalImage = dataURL;
        context.crop = true;
        context.loading = false;
        context.ref.markForCheck();
      };
      if (/(.heic|.heif)/g.test(file.type)) {
        heic2any({ blob: file, toType: 'image/jpeg' }).then(file => {
          img.src = URL.createObjectURL(file);
        }, (error) => {
          img.src = URL.createObjectURL(file);
        });
      } else {
        img.src = URL.createObjectURL(file);
      }
    } else {
      this.imageUploadError = true;
      this.ref.markForCheck();
    }
  }

  onClose() {
    this.close.emit(false);
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
    this.uploadService.upload('data:image/jpeg;base64,' + cropped, `products/${this.id}/images`).pipe(
      concatMap(croppedResult => this.uploadService.upload('data:image/jpeg;base64,' + this.originalImage, `products/${this.id}/images`)
        .pipe(map((originalResult: any) => {
          this.images.push({ cropped: croppedResult.secure_url, original: originalResult.secure_url });
        })))).subscribe(result => {
          this.zone.run(() => {
            this.crop = false;
            this.imageUploadError = false;
            this.imageError = false;
            this.ref.detectChanges();
          });
        }, err => {
          this.imageUploadError = true;
          this.crop = false;
          this.ref.detectChanges();
        });
  }

  onRemoveImage(url) {
    this.images.splice(this.images.indexOf(url), 1);
  }

  onKeyup(event: any) {
    if (event.key === ',' || event.key === 'Enter') {
      this.onAddTag();
    }
  }

  onAddTag() {
    const tag = this.form.get('tag').value;
    if (this.tags.indexOf(tag) < 0) {
      this.tags = this.tags.concat(tag.replace(/,/g, ' '));
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
      const product: Product = {
        cloudId: this.id,
        description: this.form.get('description').value,
        images: this.images,
        videos: this.video ? [this.video] : [],
        tags: this.tags,
        type: this.type,
        price: parseInt(this.form.get('price').value.replace(this.currencyChars, ''), 10),
        weight: this.form.get('weight').value
      };

      if (this.type === 'bundle') {
        this.categoryError = this.bundleCategories.size < 1 ? true : false;
        this.sizeError = !this.bundleSizes.length ? true : false;
        if (this.sizeError || this.categoryError) {
          this.loading = false;
          return;
        }
        const categories = new Set();
        this.bundleCategories.forEach((value, key) => {
          categories.add(key);
          value.forEach(item => categories.add(item))
        });
        product.categories = [...categories] as string[];
        product.sizes = this.bundleSizes;
        product.quantity = parseInt(this.form.get('quantity').value);
      } else {
        product.brand = this.form.get('brand').value;
        product.title = this.form.get('title').value,
          product.categories = this.categoryArray['controls'].map(c => c.value.id);
        if (this.form.get('brand').value) {
          product.brand = this.form.get('brand').value;
        }
        if (this.form.get('size').value) {
          product.sizeId = this.form.get('size').value;
        }
        if (this.form.get('color').value) {
          product.colorId = this.form.get('color').value;
        }
        if (this.form.get('retailPrice').value) {
          product.retailPrice = parseInt(this.form.get('retailPrice').value.replace(this.currencyChars, ''), 10);
        }
      }
      if (this.edit) {
        this.productService.patchProduct(product, this.product.id).subscribe(response => {
          this.loading = false;
          this.close.emit(true);
        }, error => {
          this.saveError = true;
          this.loading = false;
        })
      } else {
        this.productService.postProduct(product, this.currentUser.id).subscribe(response => {
          this.loading = false;
          this.close.emit(true);
          this.ref.markForCheck();
        }, error => {
          this.saveError = true;
          this.loading = false;
          this.ref.markForCheck();
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

  validatePrice(control: AbstractControl): { [key: string]: any } | null {
    if (control.value) {
      const currencyChars = new RegExp('[\.,$]', 'g');
      const number = parseInt(control.value.replace(currencyChars, ''), 10);
      if (number < 50) {
        return { "price": "price must be greater than $0.50" }
      }
    }
    return null
  }

  get priceError(): boolean {
    if (this.form && this.form.get('price').value && !this.form.get('price').valid) {
      return true
    } else {
      return false;
    }
  }

  get price(): number {
    if (this.form && this.form.get('price').value) {
      return parseInt(this.form.get('price').value.replace(this.currencyChars, ''), 10);
    } else {
      return 0;
    }
  }

  calculateFees() {
    if (this.currentUser && this.price) {
      if (this.price >= 500) {
        this.sellerEarnings = this.price - ((Math.round(.1 * this.price) + (Math.round(.029 * this.price))));
        this.earningsBreakdown = '* after 10% commission fee + 2.9% secure payment fee'
      } else {
        this.sellerEarnings = this.price - 50;
        this.earningsBreakdown = '* after a flat $0.50 commission fee'
      }
      if (this.currentUser.seller && this.currentUser.seller.freeSales > 1) {
        this.earningsBreakdown += `, but no commission or fees for the next ${this.currentUser.seller.freeSales} sales`;
      } else if (this.currentUser.seller && this.currentUser.seller.freeSales === 1) {
        this.earningsBreakdown += `, but no commission or fees for your next sale`;
      }
    }
  }

  get selectedBundleCategories(): string[] {
    const categories = [];
    this.bundleCategories.forEach((value, key) => {
      const category = this.lookupService.getCategory(key);
      categories.push(category.id);
    });
    return categories;
  }

  setSizesFromCategory(category: Category) {
    this.sizes.forEach(size => {
      if (size.categoryIds.indexOf(category.id) > -1) {
        size.filters.forEach(filter => {
          if (!this.currentSizes.some(size => filter.key === size.key)) {
            this.currentSizes.push(filter);
          }
        });
      }
    });
  }
}
