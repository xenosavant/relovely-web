import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../base.service';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable, Subject, of } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({ providedIn: 'root' })
export class
    UserService extends BaseService {

    private userSubject$ = new Subject<UserDetail>();
    public user$ = this.userSubject$.asObservable();

    private loggedInSubject$ = new Subject<boolean>();
    public loggedIn$ = this.loggedInSubject$.asObservable();

    constructor(private localStorageService: LocalStorageService, httpClient: HttpClient) {
        super(httpClient);
    }

    private _currentUser: UserDetail;

    private _jwt: string;

    public get currentUser() {
        return this._currentUser;
    }

    public async getCurrentUser(): Promise<UserDetail> {
        if (this._currentUser) {
            return this._currentUser;
        } else {
            return this.user$.toPromise();
        }
    }

    public get jwt() {
        return this._jwt;
    }

    public set jwt(val: string) {
        this._jwt = val;
    }

    public setLogin(jwt: string, user: UserDetail) {
        this._jwt = jwt;
        this.localStorageService.setItem('jwt', jwt);
        this._currentUser = user;
        this.localStorageService.setItem('currentUser', user);
        this.userSubject$.next(user);
        this.loggedInSubject$.next(true);
    }

    public logout() {
        this.localStorageService.removeItem('jwt');
        this.localStorageService.removeItem('currentUser');
        this._currentUser = null;
        this._jwt = null;
        this.loggedInSubject$.next(false);
        this.userSubject$.next(null);
    }

    getUser(userId: string): Observable<UserDetail> {
        return this.httpClient.get<UserDetail>(`${this.apiBaseUrl}/users/${userId}`).pipe(
            map((user: UserDetail) => {
                return user;
            })
        );
    }

    me(): Observable<UserDetail> {
        return this.httpClient.get<UserDetail>(`${this.apiBaseUrl}/users/me`).pipe(
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