import { Injectable, OnInit } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { map, flatMap, switchMap, tap, concatMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { guid } from '../utils/rand';

@Injectable({
    providedIn: 'root'
})
export class FileUploadService extends BaseService {

    constructor(httpClient: HttpClient) {
        super(httpClient);
    }

    public upload(data: any, id: string, type: string, publicId: string = null) {

        const formData = new FormData();
        const timestamp = Date.now().toString();
        formData.append('file', data);
        formData.append('upload_preset', environment.cloudinaryImageUploadPreset);
        formData.append('api_key', environment.cloudinaryApiKey);
        formData.append('timestamp', timestamp);
        formData.append('folder', id);
        if (publicId) {
            formData.append('public_id', publicId)
        }
        // formData.append('background_removal', 'cloudinary_ai');

        console.log(environment.cloudinaryImageUploadPreset);
        console.log(id);
        const payload: any = { folder: id, timestamp: timestamp, uploadPreset: environment.cloudinaryImageUploadPreset }
        if (publicId) {
            payload.publicId = publicId;
        }
        return this.httpClient.post<{ signature: string }>(`${this.apiBaseUrl}/storage/signature`, payload).pipe(
            concatMap(response => {
                formData.append('signature', response.signature);
                return this.httpClient.post<any>(`${this.cloudinaryUploadUrl}/upload`, formData)
                    .pipe(map((result: any) => result))
            }))
    }

    public getSignature(id: string, timestamp: string, preset: string) {
        console.log(preset);
        console.log(id);
        return this.httpClient.post<{ signature: string }>(`${this.apiBaseUrl}/storage/signature`, { folder: id, timestamp: timestamp, uploadPreset: preset }).pipe(map(response => {
            return response.signature;
        }));
    }
}