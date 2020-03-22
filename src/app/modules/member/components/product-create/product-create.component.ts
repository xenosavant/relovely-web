import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators, FormGroup, FormArray, FormBuilder, AbstractControl } from '@angular/forms';
import { Category } from '@app/shared/models/category.model';
import { CategoryService } from '@app/shared/services/category.service';
import { womensSizes } from '../../../../data/sizes.data';
import { KeyValue } from '@angular/common';
import { guid } from '../../../../shared/utils/rand';
import { FileUploadService } from '../../../../shared/services/file-upload.service'
import { ImageSet } from '@app/shared/interfaces/image-set.interface';
import { forkJoin } from 'rxjs';
import { Video } from '@app/shared/interfaces/video';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCreateComponent implements OnInit {

  @Output() close: EventEmitter<any> = new EventEmitter;

  public imageChangedEvent: any = null;
  public crop = false;
  public form: FormGroup;
  public categories: Array<Category[]> = [];
  public video: Video;
  public images: ImageSet[] = [];
  public rootCategories = [];
  public currentSizes = womensSizes.map((value) => value.filters).reduce((previous, current) => previous.concat(current), []);
  public tags: string[] = [];
  public selectable = true;
  public removable = true;
  public id: string;
  public originalImage: string;


  constructor(private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private uploadService: FileUploadService,
    private readonly zone: NgZone,
    private ref: ChangeDetectorRef) {
    this.categoryService.getCatgories().subscribe(cats => {
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
      this.rootCategories = cats;
      this.categories.push(cats);
    });

  }

  ngOnInit() {
    this.id = guid();
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
    }
  }

  log() {
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
          this.ref.detectChanges();
        });
      });

    this.crop = false;
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
    console.log({
      title: this.form.get('title').value,
      description: this.form.get('description').value,
      categories: this.categoryArray['controls'].map(c => c.value.id),
      brand: this.form.get('brand').value,
      tags: this.tags,
      price: this.form.get('price').value
    })
  }

}
