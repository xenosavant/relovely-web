import { Injectable, OnInit } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { selectIsAuthenticated } from './auth.selectors';
import { AppState } from '../core.state';
import { Category } from '../models/category.model';
import { categories } from '@app/data/categories.data';

@Injectable()
export class CategoryService {

    private _categories: Category[];

    public currentCategories: Category[];
    public categoryLookup = {};

    constructor() {
        this._categories = categories;
    }

    public getCatgories(): Observable<Category[]> {
        return of(this._categories);
    }



}