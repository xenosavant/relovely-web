import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SignupResponse } from './signup.response'
import { SignupRequest } from './signup.request';
import { SigninRequest } from './signin.request';
import { UserDetail } from '@app/shared/models/user-detail.model';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService {

    signup(request: SignupRequest): Observable<SignupResponse> {
        return this.httpClient.post(`${this.apiBaseUrl}/signup`, request).pipe(
            map((response: SignupResponse) => {
                return response;
            }), catchError(this.errorHandler)
        );
    }

    signin(request: SigninRequest): Observable<SignupResponse> {
        return this.httpClient.post(`${this.apiBaseUrl}/signin`, request).pipe(
            map((response: SignupResponse) => {
                return response;
            }), catchError(this.errorHandler)
        );
    }

    signupWithInstagram(code: string): Observable<UserDetail> {
        return this.httpClient.post<UserDetail>(`${this.apiBaseUrl}/instagram/signup`, { code: code }).pipe(
            map((user: UserDetail) => {
                return user;
            })
        );
    }
}

