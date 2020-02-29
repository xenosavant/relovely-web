import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef, NgZone } from '@angular/core';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { environment } from '@env/environment';
import { Video } from '@app/shared/interfaces/video';

@Component({
  selector: 'app-video-uploader',
  templateUrl: './video-uploader.component.html',
  styleUrls: ['./video-uploader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoUploaderComponent implements OnInit {

  private uploader: FileUploader;
  public uploading = false;
  public percentage = 0;
  public video: Video;

  @Input() id: string;
  @Output() completed: EventEmitter<Video> = new EventEmitter<Video>();

  constructor(
    private ref: ChangeDetectorRef,
    private zone: NgZone) { }

  ngOnInit(): void {
    // Create the file uploader, wire it to upload to your account
    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${environment.cloudinaryCloudName}/upload`,
      // Upload files automatically upon addition to upload queue
      autoUpload: true,
      // Use xhrTransport in favor of iframeTransport
      isHTML5: true,
      // Calculate progress independently for each uploaded file
      removeAfterUpload: true,
      // XHR request headers
      headers: [
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest'
        }
      ]
    };
    this.uploader = new FileUploader(uploaderOptions);

    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      // Add Cloudinary's unsigned upload preset to the upload form
      form.append('upload_preset', environment.cloudinaryUploadPreset);
      form.append('folder', `${this.id}/video`);
      form.append('file', fileItem);

      // Use default "withCredentials" value for CORS requests
      fileItem.withCredentials = false;
      return { fileItem, form };
    };
    // Update model on completion of uploading a file
    this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) => {
      const parsedResponse = JSON.parse(response);
      const video = {
        width: parsedResponse.width,
        height: parsedResponse.height,
        url: parsedResponse.url,
        publicId: parsedResponse.public_id,
        bytes: parsedResponse.bytes
      };
      this.completed.emit(video);
      this.zone.run(() => {
        this.video = video;
        this.percentage = 0;
        this.uploading = false;
        this.ref.detectChanges();
      });
    }
    this.uploader.onProgressItem = (fileItem: any, progress: any) => {
      this.zone.run(() => {
        this.uploading = true;
        this.percentage = progress;
        this.ref.detectChanges();
      });

    }
  }
  onRemoveImage() {
    this.video = null;
    this.completed.emit(null);
  }
}
