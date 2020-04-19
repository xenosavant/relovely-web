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
import { UserDetail } from '@app/shared/models/user-detail.model';
import { UserService } from '../user/user.service';

@Injectable()
export class FilterService extends BaseService {

    private _state: IUserPreferences;

    public async getState(): Promise<IUserPreferences> {
        if (this._state) {
            return this._state;
        } else {
            return this.filterState$.toPromise();
        }
    }

    private filterStateSubject$ = new Subject<IUserPreferences>();
    public filterState$ = this.filterStateSubject$.asObservable();

    constructor(private localStorage: LocalStorageService, httpClient: HttpClient, private userService: UserService) {
        super(httpClient);
        this.userService.getCurrentUser().then(user => {
            if (user) {
                this._state = user.preferences || {};
                console.log(this._state);
                this.filterStateSubject$.next(this._state);
            } else {
                this.filterStateSubject$.next(null);
            }
        })
    }

    public updateColors(colors: string[]) {
        this._state.colors = colors || [];
        const user = this.localStorage.getItem('currentUser');
        if (user) {
            this.setPreferences(user.id, this._state).subscribe(result => {
                user.preferences = this._state;
                this.localStorage.setItem('currentUser', user);
            });
        }
        this.filterStateSubject$.next(this._state);
    }

    public updateSizes(sizes: string[]) {
        this._state.sizes = sizes || [];
        const user = this.localStorage.getItem('currentUser');
        if (user) {
            this.setPreferences(user.id, this._state).subscribe(result => {
                user.preferences = this._state;
                this.localStorage.setItem('currentUser', user);
            });
        }
        this.filterStateSubject$.next(this._state);
    }

    public updatePrices(prices: PriceRange[]) {
        this._state.prices = prices || [];
        const user = this.localStorage.getItem('currentUser');
        if (user) {
            this.setPreferences(user.id, this._state).subscribe(result => {
                user.preferences = this._state;
                this.localStorage.setItem('currentUser', user);
            });
        }
        this.filterStateSubject$.next(this._state);
    }


    setPreferences(userId: string, preferences: IUserPreferences): Observable<boolean> {
        return this.httpClient.patch<IUserPreferences>(`${this.apiBaseUrl}/users/${userId}`, { preferences: preferences }).pipe(
            map(() => {
                return true;
            })
        );
    }
}