import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '@app/shared/services/user/user.service';
import { NavigationService } from '../services/navigation/navigation.service';
import { UserAuth } from '../models/user-auth.model';

@Injectable()
export class AuthenticationGuard implements CanActivate, CanActivateChild {
    constructor(private userService: UserService, private navigationService: NavigationService) { }

    canActivate(): Observable<boolean> {
        return this.userService.user$.pipe(
            map((user: UserAuth) => {
                if (!user) {
                    this.navigationService.openAuthWindow({ page: 'signin' });
                }
                return user ? true : false;
            })
        );
    }

    canActivateChild(): Observable<boolean> {
        return this.userService.user$.pipe(
            map((user: UserAuth) => {
                return user ? true : false;
            })
        );
    }
}