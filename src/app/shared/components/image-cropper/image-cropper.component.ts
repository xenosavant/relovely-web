import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ImageSet } from '@app/shared/interfaces/image-set.interface';

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

  @Input() public image: string;
  @Input() public showInfo = false;


  constructor() { }

  ngOnInit() {

  }

  public cropperReady(): void {
    this.visibilty = 'visible';
    this.ready = true;
  }

  public imageLoaded() {

  }

  public loadImageFailed(): void {
    // show message
  }

  public onImageCropped(): void {
    this.ready = false;
    this.crop.emit(this.currentImage);
  }

  public onCancel(): void {
    this.cancel.emit(true);
  }

  public imageCropped(event: ImageCroppedEvent): void {
    this.currentImage = event.base64.split(',')[1];
  }

}
