import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from '../base.service';
import { IUserPreferences, PriceRange } from './filter-state';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user/user.service';

@Injectable()
export class FilterService extends BaseService {

    private emptyState = { sizes: [], colors: [], prices: [], types: [] };
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

    public updateTypes(types: string[]) {
        this._state.types = [...types];
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
            prices: [],
            types: []
        }
        const user = this.userService.user$.getValue();
        if (user) {
            this.userService.updateUser(user.id, { preferences: this._state }).subscribe(u => {
                this.userService.setCurrentUser(u);
            });
        }
        this.filterStateSubject$.next(this._state);
    }
}