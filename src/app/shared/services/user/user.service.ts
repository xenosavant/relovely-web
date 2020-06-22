import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../base.service';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable, Subject, of, BehaviorSubject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { UserAuth } from '@app/shared/models/user-auth.model';
import { SellerVerificationRequest } from './seller-verification.request';
import { BankAccountRequest } from './bank-acount-request';
import { PaymentCard } from '@app/shared/interfaces/payment-card';
import { Review } from '@app/shared/models/review.model';
import { UserReviewsResponse } from './user-reviews.response';
import { SellerApplicationRequest } from './seller-application.request';
import { AlertService } from '../alert/alert.service';

@Injectable({ providedIn: 'root' })
export class
    UserService extends BaseService {

    public user$ = new BehaviorSubject<UserAuth>(null);

    public loggedIn$ = new BehaviorSubject<boolean>(false);

    constructor(private localStorageService: LocalStorageService, httpClient: HttpClient, private alertService: AlertService) {
        super(httpClient);
    }

    private _currentUser: UserAuth;

    private _jwt: string;
    private _notLoggedIn = false;

    public setCurrentUser(user: UserAuth): void {
        this._currentUser = user;
        if (user) {
            if (user.sales && user.sales.length) {
                this.alertService.setAlert({ menuItem: 'Sales', alert: true });
            } else {
                this.alertService.setAlert({ menuItem: 'Sales', alert: false });
            }
        }
        this.user$.next(user);
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
        this._notLoggedIn = false;

        this.setCurrentUser(user);
        this.loggedIn$.next(true);
    }

    public logout() {
        this.localStorageService.removeItem('jwt');
        this.localStorageService.removeItem('currentUser');
        this._jwt = null;
        this._notLoggedIn = true;
        this.loggedIn$.next(false);
        this.setCurrentUser(null);
    }

    getUser(userId: string): Observable<UserDetail> {
        return this.httpClient.get<UserDetail>(`${this.apiBaseUrl}/users/${userId}`).pipe(
            map((user: UserDetail) => {
                return user;
            })
        );
    }

    getFeatured(): Observable<UserDetail[]> {
        return this.httpClient.get<UserDetail[]>(`${this.apiBaseUrl}/users/featured`).pipe(
            map((users: UserDetail[]) => {
                return users;
            })
        );
    }

    getReviews(userId: string): Observable<UserReviewsResponse> {
        return this.httpClient.get<UserReviewsResponse>(`${this.apiBaseUrl}/users/${userId}/reviews`).pipe(
            map((reviews: UserReviewsResponse) => {
                return reviews;
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

    applyToSell(request: SellerApplicationRequest): Observable<void> {
        return this.httpClient.post<void>(`${this.apiBaseUrl}/users/apply`, request).pipe(
            map(() => {
                return;
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