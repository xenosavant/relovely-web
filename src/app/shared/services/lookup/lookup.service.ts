import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { Category } from '../../models/category.model';
import { SizeFilterGroup } from '../../models/size-filter-group.model';
import { BaseService } from '../base.service';
import { LookupResponse } from './lookup.response';
import { map, catchError } from 'rxjs/operators';
import { SignupResponse } from '../auth/signup.response';
import { INavigationState } from '@app/shared/interfaces/navigation-state.interface';
import { LookupState } from './lookup-state';
import { ColorFilter } from '@app/shared/interfaces/color-filter.interface';
import { states } from '../../../data/states'
import { State } from './state';

@Injectable()
export class LookupService extends BaseService {

    private _state: LookupState;
    private _catMap = {};
    private _sizeMap = {};
    private _colorNameMap = {};
    private _colorMap = {};
    private _states: State[] = [];

    private _stateSubject$ = new Subject<LookupState>();
    public state$ = this._stateSubject$.asObservable();

    public navLookup = {};

    public async getState(): Promise<LookupState> {
        if (this._state) {
            return this._state;
        } else {
            return this.state$.toPromise();
        }
    }

    public getLookupData(): Observable<LookupResponse> {
        Object.entries(states).forEach(item => {
            this._states.push({ abbreviation: item[0], full: item[1] })
        })
        return this.httpClient.get(`${this.apiBaseUrl}/lookup`).pipe(
            map((response: LookupResponse) => {
                this._state = {
                    categories: JSON.parse(response.categories.json),
                    sizes: JSON.parse(response.sizes.json),
                    colors: JSON.parse(response.colors.json),
                    prices: JSON.parse(response.prices.json),
                }
                this._state.categories.forEach(cat => {
                    this.populateParents(cat);
                });
                this._state.sizes.forEach(sizes => {
                    this.buildSizeDictionary(sizes);
                });
                this.buildColorDictionary(this._state.colors);
                this._stateSubject$.next(this._state);
                return response;
            }), catchError(this.errorHandler)
        );
    }

    public getCategory(id: string) {
        return this._catMap[id];
    }

    public getSize(id: string) {
        return this._sizeMap[id];
    }

    public getColorName(id: string) {
        return this._colorNameMap[id];
    }

    public getColor(id: string) {
        return this._colorMap[id];
    }

    private populateParents(category: Category) {
        this._catMap[category.id] = category;
        if (category.children) {
            category.children.forEach(cat => {
                cat.parent = category;
                this.populateParents(cat);
            });
        }
    }

    private buildSizeDictionary(group: SizeFilterGroup) {
        group.filters.forEach(filter => {
            this._sizeMap[filter.key] = filter.value;
        })
    }

    private buildColorDictionary(colors: ColorFilter[]) {
        colors.forEach(color => {
            this._colorNameMap[color.key] = color.value;
        });
        colors.forEach(color => {
            this._colorMap[color.key] = color.color;
        })
    }

    public get states() {
        return this._states;
    }
}