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
import { UserAuth } from '@app/shared/models/user-auth.model';
import { InstagramTokenResponse } from './instagram-token.response';

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

    linkInstagram(code: string): Observable<UserAuth> {
        return this.httpClient.post<UserAuth>(`${this.apiBaseUrl}/instagram/link`, { code: code }).pipe(
            map((user) => {
                return user;
            })
        );
    }

    sellWithInstagram(email: string, code: string): Observable<void> {
        return this.httpClient.post<void>(`${this.apiBaseUrl}/instagram/sell`, { code: code, email: email }).pipe(
            map(() => {
                return;
            })
        );
    }

    signupWithInstagram(email: string, code: string): Observable<void> {
        return this.httpClient.post<void>(`${this.apiBaseUrl}/instagram/signup`, { code: code, email: email }).pipe(
            map(() => {
                return;
            })
        );
    }

    getInstagramToken(token: string, type: 'member' | 'seller'): Observable<InstagramTokenResponse> {
        return this.httpClient.post<InstagramTokenResponse>(`${this.apiBaseUrl}/instagram/token`, { token: token, type: type }).pipe(
            map((token) => {
                return token;
            })
        );
    }

    linkFacebook(code: string): Observable<UserAuth> {
        return this.httpClient.post<UserAuth>(`${this.apiBaseUrl}/facebook/link`, { code: code }).pipe(
            map((response: UserAuth) => {
                return response;
            })
        );
    }

    continueWithFacebook(code: string): Observable<SignupResponse> {
        return this.httpClient.post<SignupResponse>(`${this.apiBaseUrl}/facebook/continue`, { code: code }).pipe(
            map((response: SignupResponse) => {
                return response;
            })
        );
    }
}

