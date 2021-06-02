import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '@app/shared/services/user/user.service';
import { UserAuth } from '../models/user-auth.model';

@Injectable()
export class SellerGuard implements CanActivate, CanActivateChild {
    constructor(private userService: UserService) { }

    canActivate(): Observable<boolean> {
        return this.userService.user$.pipe(
            map((user: UserAuth) => {
                return user && user.type === 'seller';
            })
        );
    }

    canActivateChild(): Observable<boolean> {
        return this.userService.user$.pipe(
            map((user: UserAuth) => {
                return user && user.type === 'seller';
            })
        );
    }
}