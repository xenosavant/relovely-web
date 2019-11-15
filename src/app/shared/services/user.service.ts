import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetail } from '../models/user-detail.model';

@Injectable({ providedIn: 'root' })
export class UserService {

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

    constructor(private router: Router) {

    }

}