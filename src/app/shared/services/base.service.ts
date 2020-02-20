import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ObservableInput } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BaseService {

    apiBaseUrl: string;
    instagramBaseUrl: string;
    instagramAuthUrl: string;
    instagramAccessTokenUrl: string

    public formContentOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    };

    constructor(
        protected httpClient: HttpClient
    ) {
        this.apiBaseUrl = environment.apiUrl;
        this.instagramBaseUrl = environment.instagramGraphUrl;
        this.instagramAuthUrl = environment.instagramAuthUrl;
        this.instagramAccessTokenUrl = environment.instagramAccessTokenUrl;
    }

    protected errorHandler(error: any): ObservableInput<any> {
        throw error;
    }

}