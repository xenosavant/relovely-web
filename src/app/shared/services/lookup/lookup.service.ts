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

@Injectable()
export class LookupService extends BaseService {

    private _state: LookupState;
    private _catMap = {};

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
        return this.httpClient.get(`${this.apiBaseUrl}/lookup`).pipe(
            map((response: LookupResponse) => {
                this._state = {
                    categories: JSON.parse(response.categories.json),
                    sizes: JSON.parse(response.sizes.json)
                }
                this._state.categories.forEach(cat => {
                    this.populate(cat);
                });
                this._stateSubject$.next(this._state);
                return response;
            }), catchError(this.errorHandler)
        );
    }

    public getCategory(id: string) {
        return this._catMap[id];
    }

    private populate(category: Category) {
        this._catMap[category.id] = category;
        if (category.children) {
            category.children.forEach(cat => {
                cat.parent = category;
                this.populate(cat);
            });
        }
    }
}