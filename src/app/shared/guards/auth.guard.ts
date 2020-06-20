import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthenticationService, IAuthentication } from '../services/authentication.service';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { UserService } from '@app/shared/services/user/user.service';
import { NavigationService } from '../services/navigation/navigation.service';

@Injectable()
export class AuthenticationGuard implements CanActivate, CanActivateChild {
    constructor(private userService: UserService, private navigationService: NavigationService) { }

    canActivate(): Observable<boolean> {
        return this.userService.loggedIn$.pipe(
            map((loggedIn: boolean) => {
                if (!loggedIn) {
                    this.navigationService.openAuthWindow({ page: 'signin' });
                }
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