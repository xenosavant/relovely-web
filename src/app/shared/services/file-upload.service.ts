import { Injectable, OnInit } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FileUploadService extends BaseService {

    constructor(httpClient: HttpClient) {
        super(httpClient);
    }

    public upload(data: any, id: string, type: string) {

        const formData = new FormData();

        formData.append('file', data);
        formData.append('upload_preset', environment.cloudinaryUploadPreset);
        formData.append('folder', `${id}/${type}`);
        // formData.append('background_removal', 'cloudinary_ai');

        return this.httpClient.post<any>(this.cloudinaryUploadUrl, formData, {
            reportProgress: false,
            observe: 'events'
        }).pipe(map((event: any) => {
            return event.body;
        })
        );
    }


}