import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../base.service';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {

    private _currentUser: UserDetail = {
        id: '43dfbf0c-d29f-4074-9315-d8d434c5a8f2',
        firstName: 'Samantha',
        lastName: 'Heintzelman',
        username: 'influencer1987',
        imageUrl: './assets/images/influencer.jpeg',
        numberListings: 12,
        numberSales: 15,
        numberFollowers: 1150,
        numberFollowing: 246,
        products: [],
        isSeller: true
    };

    public get currentUser() {
        return this._currentUser;
    }

    getUser(userId: string): Observable<UserDetail> {
        return this.httpClient.get<UserDetail>(`users/${userId}`).pipe(
            map((user: UserDetail) => {
                return user;
            })
        );
    }
}