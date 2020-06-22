import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef, NgZone } from '@angular/core';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { environment } from '@env/environment';
import { FileUploadService } from '@app/shared/services/file-upload.service';
import { VideoMetaData } from '@app/shared/interfaces/video-meta-data';

@Component({
  selector: 'app-video-uploader',
  templateUrl: './video-uploader.component.html',
  styleUrls: ['./video-uploader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoUploaderComponent implements OnInit {

  public uploader: FileUploader;
  public uploading = false;
  public percentage = 0;
  public video: VideoMetaData;
  public timestamp = Date.now().toString();

  @Input() id: string;
  @Output() completed: EventEmitter<VideoMetaData> = new EventEmitter<VideoMetaData>();

  constructor(
    private ref: ChangeDetectorRef,
    private zone: NgZone,
    private uploadService: FileUploadService) { }

  ngOnInit(): void {
    this.uploadService.getSignature(`products/${this.id}/videos`, this.timestamp, environment.cloudinaryVideoUploadPreset, 'video').subscribe(signature => {

      // Create the file uploader, wire it to upload to your account
      const uploaderOptions: FileUploaderOptions = {
        url: `${environment.cloudinaryUploadUrl}/upload`,
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
        form.append('upload_preset', environment.cloudinaryVideoUploadPreset);
        form.append('folder', `products/${this.id}/videos`);
        form.append('file', fileItem);
        form.append('timestamp', this.timestamp);
        form.append('api_key', environment.cloudinaryApiKey);

        form.append('signature', signature);
        form.append('public_id', "video");
        form.append('unique_filename', 'false');

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
          bytes: parsedResponse.bytes,
          format: parsedResponse.format
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
    })
  }

  onRemoveImage() {
    this.video = null;
    this.completed.emit(null);
  }
}
