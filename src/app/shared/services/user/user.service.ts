import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../base.service';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable, Subject, of } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { UserAuth } from '@app/shared/models/user-auth.model';
import { SellerVerificationRequest } from './seller-verification.request';
import { BankAccountRequest } from './bank-acount-request';
import { PaymentCard } from '@app/shared/interfaces/payment-card';

@Injectable({ providedIn: 'root' })
export class
    UserService extends BaseService {

    private userSubject$ = new Subject<UserAuth>();
    public user$ = this.userSubject$.asObservable();

    private loggedInSubject$ = new Subject<boolean>();
    public loggedIn$ = this.loggedInSubject$.asObservable();

    constructor(private localStorageService: LocalStorageService, httpClient: HttpClient) {
        super(httpClient);
    }

    private _currentUser: UserAuth;

    private _jwt: string;
    private _notLoggedIn = false;

    public get currentUser() {
        return this._currentUser;
    }

    public async getCurrentUser(): Promise<UserAuth> {
        if (this._currentUser || this._notLoggedIn) {
            return this._currentUser;
        } else {
            return this.user$.toPromise();
        }
    }

    public setCurrentUser(user: UserAuth): void {
        this._currentUser = user;
        this.localStorageService.setItem('currentUser', user);
    }

    public get jwt() {
        return this._jwt;
    }

    public set jwt(val: string) {
        this._jwt = val;
    }

    public setLogin(jwt: string, user: UserAuth) {
        this._jwt = jwt;
        this.localStorageService.setItem('jwt', jwt);
        this._currentUser = user;
        this.localStorageService.setItem('currentUser', user);
        this._notLoggedIn = false;
        this.userSubject$.next(user);
        this.loggedInSubject$.next(true);
        console.log('setting login')
    }

    public logout() {
        this.localStorageService.removeItem('jwt');
        this.localStorageService.removeItem('currentUser');
        this._currentUser = null;
        this._jwt = null;
        this._notLoggedIn = true;
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

    me(): Observable<UserAuth> {
        return this.httpClient.get<UserAuth>(`${this.apiBaseUrl}/users/me`).pipe(
            map((user: UserAuth) => {
                return user;
            })
        );
    }

    updateUser(userId: string, updates: Partial<UserAuth>): Observable<UserAuth> {
        return this.httpClient.patch<UserAuth>(`${this.apiBaseUrl}/users/${userId}`, updates).pipe(
            map((user: UserAuth) => {
                this.setCurrentUser(user);
                return user;
            })
        );
    }

    followUser(userId: string, follow: boolean): Observable<void> {
        return this.httpClient.patch<void>(`${this.apiBaseUrl}/users/${userId}/follow/?follow=${follow}`, {}).pipe();
    }

    addCard(card: PaymentCard): Observable<UserAuth> {
        return this.httpClient.post<UserAuth>(`${this.apiBaseUrl}/users/add-card`, card).pipe(
            map((user: UserAuth) => {
                console.log(user);
                this.setCurrentUser(user);
                return user;
            })
        );
    }

    verifySeller(request: SellerVerificationRequest): Observable<UserAuth> {
        return this.httpClient.post<UserAuth>(`${this.apiBaseUrl}/users/verify`, request).pipe(
            map((user: UserAuth) => {
                this.setCurrentUser(user);
                return user;
            })
        );
    }

    updateSeller(request: Partial<SellerVerificationRequest>): Observable<UserAuth> {
        return this.httpClient.post<UserAuth>(`${this.apiBaseUrl}/users/update-verification`, request).pipe(
            map((user: UserAuth) => {
                this.setCurrentUser(user);
                return user;
            })
        );
    }

    addBank(request: BankAccountRequest): Observable<UserAuth> {
        return this.httpClient.post<UserAuth>(`${this.apiBaseUrl}/users/add-bank`, request).pipe(
            map((user: UserAuth) => {
                this.setCurrentUser(user);
                return user;
            })

        );
    }


}