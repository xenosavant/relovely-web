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

    private emptyState = { sizes: [], colors: [], prices: [] };
    private _state: IUserPreferences = this.emptyState;

    public filterStateSubject$ = new BehaviorSubject<IUserPreferences>(this.emptyState);

    constructor(private localStorage: LocalStorageService, httpClient: HttpClient, private userService: UserService) {
        super(httpClient);
        const user = this.userService.user$.getValue();
        if (user) {
            this._state = user.preferences || this.emptyState;
            this.filterStateSubject$.next(this._state);
        }
    }

    public updateColors(colors: string[]) {
        this._state.colors = colors || [];
        const user = this.userService.user$.getValue();
        if (user) {
            this.userService.updateUser(user.id, { preferences: this._state }).subscribe(u => {
                this.userService.setCurrentUser(u);
            });
        }
        this.filterStateSubject$.next(this._state);
    }

    public updateSizes(sizes: string[]) {
        this._state.sizes = sizes || [];
        const user = this.userService.user$.getValue();
        if (user) {
            this.userService.updateUser(user.id, { preferences: this._state }).subscribe(u => {
                this.userService.setCurrentUser(u);
            });
        }
        this.filterStateSubject$.next(this._state);
    }

    public updatePrices(prices: PriceRange[]) {
        this._state.prices = prices || [];
        const user = this.userService.user$.getValue();
        if (user) {
            this.userService.updateUser(user.id, { preferences: this._state }).subscribe(u => {
                this.userService.setCurrentUser(u);
            });
        }
        this.filterStateSubject$.next(this._state);
    }

    public clear() {
        this._state = {
            sizes: [],
            colors: [],
            prices: []
        }
        this.filterStateSubject$.next(this._state);
    }
}