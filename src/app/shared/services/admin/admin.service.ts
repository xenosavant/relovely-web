import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CreateSellerRequest } from './create-seller.request';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { UserAuth } from '@app/shared/models/user-auth.model';
import { ApproveSellerRequest } from './approve-seller.request';

@Injectable({ providedIn: 'root' })
export class AdminService extends BaseService {

    createSeller(request: CreateSellerRequest): Observable<void> {
        return this.httpClient.post(`${this.apiBaseUrl}/admin/create-seller`, request).pipe(
            map(() => {
                return;
            }), catchError(this.errorHandler)
        );
    }

    getSellers(): Observable<UserAuth[]> {
        return this.httpClient.get<UserAuth[]>(`${this.apiBaseUrl}/admin/sellers`).pipe(
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

}