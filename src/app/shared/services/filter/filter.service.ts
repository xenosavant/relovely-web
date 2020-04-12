import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject, of, BehaviorSubject } from 'rxjs';
import { Category } from '../../models/category.model';
import { SizeFilterGroup } from '../../models/size-filter-group.model';
import { BaseService } from '../base.service';
import { LookupResponse } from './lookup.response';
import { map, catchError } from 'rxjs/operators';
import { SignupResponse } from '../auth/signup.response';
import { INavigationState } from '@app/shared/interfaces/navigation-state.interface';
import { LookupState } from './lookup-state';
import { IFilterState, IUserPreferences, PriceRange } from './filter-state';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FilterService extends BaseService {

    private _state: IUserPreferences;

    private filterStateSubject$ = new Subject<IUserPreferences>();
    public filterState$ = this.filterStateSubject$.asObservable();

    constructor(private localStorage: LocalStorageService, httpClient: HttpClient) {
        super(httpClient);
        const user = this.localStorage.getItem('currentUser');
        if (user) {
            this._state = user.preferences || {};
        }
    }

    public updateColors(colors: string[]) {
        const user = this.localStorage.getItem('currentUser');
        if (user) {
            this._state.colors = colors;
            this.setPreferences(user.id, this._state).subscribe(result => {
                user.preferences = this._state;
                this.localStorage.setItem('currentUser', user);
                this.filterStateSubject$.next(this._state);
            });
        }
    }

    public updateSizes(sizes: string[]) {
        console.log(sizes);
        const user = this.localStorage.getItem('currentUser');
        if (user) {
            this._state.sizes = sizes;
            this.setPreferences(user.id, this._state).subscribe(result => {
                user.preferences = this._state;
                this.localStorage.setItem('currentUser', user);
                this.filterStateSubject$.next(this._state);
            });
        }
    }

    public updatePrices(prices: PriceRange[]) {
        const user = this.localStorage.getItem('currentUser');
        if (user) {
            this._state.prices = prices;
            this.setPreferences(user.id, this._state).subscribe(result => {
                user.preferences = this._state;
                this.localStorage.setItem('currentUser', user);
                this.filterStateSubject$.next(this._state);
            });
        }
    }


    setPreferences(userId: string, preferences: IUserPreferences): Observable<boolean> {
        return this.httpClient.patch<IUserPreferences>(`${this.apiBaseUrl}/users/${userId}/preferences`, preferences).pipe(
            map(() => {
                return true;
            })
        );
    }
}