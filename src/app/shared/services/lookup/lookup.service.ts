import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../models/category.model';
import { BaseService } from '../base.service';
import { LookupResponse } from './lookup.response';
import { map, catchError } from 'rxjs/operators';
import { SignupResponse } from '../auth/signup.response';

@Injectable()
export class LookupService extends BaseService {

    private _categories: Category[];

    public get categories() {
        return this._categories;
    }

    public currentCategories: Category[];
    public categoryLookup = {};

    public getLookupData(): Observable<LookupResponse> {
        return this.httpClient.get(`${this.apiBaseUrl}/lookup`).pipe(
            map((response: LookupResponse) => {
                this._categories = JSON.parse(response.categories.json);
                return response;
            }), catchError(this.errorHandler)
        );
    }
}