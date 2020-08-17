import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CreateSellerRequest } from './create-seller.request';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { UserAuth } from '@app/shared/models/user-auth.model';
import { ApproveSellerRequest } from './approve-seller.request';
import { Promo } from '@app/shared/models/promo.model';

@Injectable({ providedIn: 'root' })
export class AdminService extends BaseService {

    createSeller(request: CreateSellerRequest): Observable<void> {
        return this.httpClient.post(`${this.apiBaseUrl}/admin/create-seller`, request).pipe(
            map(() => {
                return;
            }), catchError(this.errorHandler)
        );
    }

    getSellers(unapproved: boolean): Observable<UserAuth[]> {
        return this.httpClient.get<UserAuth[]>(`${this.apiBaseUrl}/admin/sellers?unapproved=${unapproved}`).pipe(
            map((result: UserAuth[]) => {
                return result;
            }), catchError(this.errorHandler)
        );
    }

    getMembers(): Observable<UserAuth[]> {
        return this.httpClient.get<UserAuth[]>(`${this.apiBaseUrl}/admin/members`).pipe(
            map((result: UserAuth[]) => {
                return result;
            }), catchError(this.errorHandler)
        );
    }

    approveSeller(request: ApproveSellerRequest): Observable<void> {
        return this.httpClient.post(`${this.apiBaseUrl}/admin/approve-seller`, request).pipe(
            map(() => {
                return;
            }), catchError(this.errorHandler)
        );
    }

    getPromos(): Observable<Promo[]> {
        return this.httpClient.get<Promo[]>(`${this.apiBaseUrl}/admin/promos`).pipe(
            map((result: Promo[]) => {
                return result;
            }), catchError(this.errorHandler)
        );
    }

    createPromo(promo: Promo): Observable<void> {
        return this.httpClient.post(`${this.apiBaseUrl}/admin/create-promo`, promo).pipe(
            map(() => {
                return;
            }), catchError(this.errorHandler)
        );
    }

}