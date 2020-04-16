import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../base.service';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable, Subject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({ providedIn: 'root' })
export class
    UserService extends BaseService {

    private loggedInSubject$ = new Subject<boolean>();
    public loggedIn$ = this.loggedInSubject$.asObservable();

    constructor(private localStorageService: LocalStorageService, httpClient: HttpClient) {
        super(httpClient);
        const user = this.localStorageService.getItem('currentUser');
        const jwt = this.localStorageService.getItem('jwt');
        if (user && jwt) {
            this._currentUser = user;
            this._jwt = jwt;
            this.loggedInSubject$.next(true);
        } else {
            this.loggedInSubject$.next(false);
        }
    }

    private _currentUser: UserDetail;

    private _jwt: string;

    public get currentUser() {
        return this._currentUser;
    }

    public get jwt() {
        return this._jwt;
    }

    public setLogin(jwt: string, user: UserDetail) {
        this._jwt = jwt;
        this.localStorageService.setItem('jwt', jwt);
        this._currentUser = user;
        this.localStorageService.setItem('currentUser', user);
        this.loggedInSubject$.next(true);
    }

    public logout() {
        this.localStorageService.removeItem('jwt');
        this.localStorageService.removeItem('currentUser');
        this._currentUser = null;
        this._jwt = null;
        this.loggedInSubject$.next(false);
    }

    getUser(userId: string): Observable<UserDetail> {
        return this.httpClient.get<UserDetail>(`${this.apiBaseUrl}/users/${userId}`).pipe(
            map((user: UserDetail) => {
                return user;
            })
        );
    }

    updateUser(userId: string, updates: any): Observable<UserDetail> {
        return this.httpClient.patch<UserDetail>(`${this.apiBaseUrl}/users/${userId}`, updates).pipe(
            map((user: UserDetail) => {
                return user;
            })
        );
    }
}