import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthenticationService, IAuthentication } from '../services/authentication.service';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { UserService } from '@app/shared/services/user/user.service';
import { UserAuth } from '../models/user-auth.model';

@Injectable()
export class AdminGuard implements CanActivate, CanActivateChild {
    constructor(private userService: UserService) { }

    canActivate(): Observable<boolean> {
        return this.userService.user$.pipe(
            map((user: UserAuth) => {
                return user && user.admin;
            })
        );
    }

    canActivateChild(): Observable<boolean> {
        return this.userService.user$.pipe(
            map((user: UserAuth) => {
                return user && user.admin;
            })
        );
    }
}