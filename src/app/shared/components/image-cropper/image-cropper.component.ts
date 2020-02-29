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
  private originalImage: string;
  public ready = false;
  public visibilty = 'hidden';

  @Output() public crop: EventEmitter<ImageSet> = new EventEmitter<ImageSet>();
  @Output() public cancel: EventEmitter<boolean> = new EventEmitter();

  @Input() public imageChangedEvent: any;

  constructor() { }

  ngOnInit() {
    this.originalImage = this.currentImage;
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
    this.crop.emit({ cropped: this.currentImage, original: this.originalImage });
  }

  public onCancel(): void {
    this.cancel.emit(true);
  }

  public imageCropped(event: ImageCroppedEvent): void {
    this.currentImage = event.base64.split(',')[1];
  }

}
