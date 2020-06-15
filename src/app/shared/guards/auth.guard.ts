import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthenticationService, IAuthentication } from '../services/authentication.service';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { UserService } from '@app/shared/services/user/user.service';

@Injectable()
export class AuthenticationGuard implements CanActivate, CanActivateChild {
    constructor(private userService: UserService) { }

    canActivate(): Observable<boolean> {
        return this.userService.loggedIn$.pipe(
            map((loggedIn: boolean) => {
                console.log(loggedIn);
                return loggedIn;
            })
        );
    }

    canActivateChild(): Observable<boolean> {
        return this.userService.loggedIn$.pipe(
            map((loggedIn: boolean) => {
                return loggedIn;
            })
        );
    }
}