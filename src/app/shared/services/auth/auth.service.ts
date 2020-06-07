import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SignupResponse } from './signup.response'
import { SignupRequest } from './signup.request';
import { SigninRequest } from './signin.request';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { VerifyRequest } from './verify.request';
import { EmailPasswordRequest } from './email-password.request';
import { ResetPasswordRequest } from './reset-password.request';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService {

    signup(request: SignupRequest): Observable<SignupResponse> {
        return this.httpClient.post(`${this.apiBaseUrl}/auth/signup`, request).pipe(
            map((response: SignupResponse) => {
                return response;
            }), catchError(this.errorHandler)
        );
    }

    signin(request: SigninRequest): Observable<SignupResponse> {
        return this.httpClient.post(`${this.apiBaseUrl}/auth/signin`, request).pipe(
            map((response: SignupResponse) => {
                return response;
            }), catchError(this.errorHandler)
        );
    }

    verifyEmail(request: VerifyRequest): Observable<SignupResponse> {
        return this.httpClient.post(`${this.apiBaseUrl}/auth/verify`, request).pipe(
            map((response: SignupResponse) => {
                return response;
            }), catchError(this.errorHandler)
        );
    }

    emailPasswordReset(request: EmailPasswordRequest): Observable<SignupResponse> {
        return this.httpClient.post(`${this.apiBaseUrl}/auth/password/email`, request).pipe(
            map((response: SignupResponse) => {
                return response;
            }), catchError(this.errorHandler)
        );
    }

    resetPassword(request: ResetPasswordRequest): Observable<SignupResponse> {
        return this.httpClient.post(`${this.apiBaseUrl}/auth/password/reset`, request).pipe(
            map((response: SignupResponse) => {
                return response;
            }), catchError(this.errorHandler)
        );
    }

    signupWithInstagram(email: string, code: string): Observable<void> {
        return this.httpClient.post<void>(`${this.apiBaseUrl}/instagram/signup`, { code: code, email: email }).pipe(
            map(() => {
                return;
            })
        );
    }

    signupWithFacebook(code: string): Observable<SignupResponse> {
        return this.httpClient.post<SignupResponse>(`${this.apiBaseUrl}/facebook/signup`, { code: code }).pipe(
            map((response: SignupResponse) => {
                return response;
            })
        );
    }

    linkFacebook(code: string): Observable<SignupResponse> {
        return this.httpClient.post<SignupResponse>(`${this.apiBaseUrl}/facebook/link`, { code: code }).pipe(
            map((response: SignupResponse) => {
                return response;
            })
        );
    }

    signinWithFacebook(code: string): Observable<SignupResponse> {
        return this.httpClient.post<SignupResponse>(`${this.apiBaseUrl}/facebook/signin`, { code: code }).pipe(
            map((response: SignupResponse) => {
                return response;
            })
        );
    }
}

