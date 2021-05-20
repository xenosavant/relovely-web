import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import Cropper from "cropperjs";
@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageCropperComponent implements OnInit {

  public ready = false;
  public visibilty = 'hidden';

  @ViewChild("imageElement", { static: false })
  public imageElement: ElementRef;

  @Output() public onCrop: EventEmitter<string> = new EventEmitter<string>();
  @Output() public cancel: EventEmitter<boolean> = new EventEmitter();

  @Input() public image: File;
  @Input() public showInfo = false;

  private cropper: Cropper;

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {
    console.log('init');
  }

  public ngAfterViewInit() {
    const context = this;
    this.cropper = new Cropper(this.imageElement.nativeElement, {
      zoomable: false,
      scalable: false,
      aspectRatio: 1,
      viewMode: 1,
      dragMode: 'none',
      ready: () => {
        context.visibilty = 'visible';
        context.ready = true;
        context.ref.markForCheck();
      }
    });
  }

  public onImageCropped(): void {
    const canvas = this.cropper.getCroppedCanvas();
    const currentImage = canvas.toDataURL("image/jpeg");
    this.ready = false;
    this.visibilty = 'hidden';
    this.onCrop.emit(currentImage);
  }

  public onCancel() {
    this.cancel.emit();
  }

}
