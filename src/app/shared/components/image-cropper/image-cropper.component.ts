import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageCropperComponent implements OnInit {

  private currentImage: string = null;
  public ready = false;
  public visibilty = 'hidden';

  @Output() public crop: EventEmitter<string> = new EventEmitter<string>();
  @Output() public cancel: EventEmitter<boolean> = new EventEmitter();

  @Input() public imageChangedEvent: any;

  constructor() { }

  ngOnInit() {
  }

  public imageLoaded(): void {
    this.visibilty = 'visible';
  }

  public cropperReady(): void {
    this.ready = true;
  }

  public loadImageFailed(): void {
    // show message
  }

  public onImageCropped(): void {
    this.crop.emit(this.currentImage);
  }

  public onCancel(): void {
    this.cancel.emit(true);
  }

  public imageCropped(event: ImageCroppedEvent): void {
    this.currentImage = event.base64.split(',')[1];
  }

}
