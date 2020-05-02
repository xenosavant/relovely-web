import { Component } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { UserList } from '@app/shared/models/user-list.model';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss']
})
export class HomeComponent {

    mobile: boolean;
    featuredSellers: UserList[];

    constructor(private breakpointObserver: BreakpointObserver) { }

    ngOnInit() {
        this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
            this.mobile = result.matches;
        });
        this.featuredSellers = [
            {
                profileImageUrl: '../../../assets/images/influencer.jpeg',
                firstName: 'Influencer1',
                lastName: '1',
                username: 'Influencer1',
                type: 'seller'
            },
            {
                profileImageUrl: '../../../assets/images/influencer.jpeg',
                firstName: 'Influencer1',
                lastName: '1',
                username: 'Influencer2',
                type: 'seller'
            },
            {
                profileImageUrl: '../../../assets/images/influencer.jpeg',
                firstName: 'Influencer1',
                lastName: '1',
                username: 'Influencer3',
                type: 'seller'
            },
            {
                profileImageUrl: '../../../assets/images/influencer.jpeg',
                firstName: 'Influencer1',
                lastName: '1',
                username: 'Influencer4',
                type: 'seller'
            },
        ]
    }
}
