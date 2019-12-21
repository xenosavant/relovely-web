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

  @Output() public cropped: EventEmitter<string> = new EventEmitter<string>();

  @Input() public imageChangedEvent: any;

  constructor() { }

  ngOnInit() {
  }

  public imageLoaded(): void {
    // show cropper
  }

  public cropperReady(): void {
    this.ready = true;
    this.visibilty = 'visible';
    console.log('ready')
  }

  public loadImageFailed(): void {
    // show message
  }

  public onImageCropped(): void {
    this.cropped.emit(this.currentImage);
  }

  public imageCropped(event: ImageCroppedEvent): void {
    this.currentImage = event.base64.split(',')[1];
  }

}
