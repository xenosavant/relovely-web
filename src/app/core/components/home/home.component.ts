import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { UserList } from '@app/shared/models/user-list.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { TemplatePortal } from '@angular/cdk/portal';
import { OverlayService } from '@app/shared/services/overlay.service';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { UserAuth } from '@app/shared/models/user-auth.model';
import { UserService } from '@app/shared/services/user/user.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss']
})
export class HomeComponent {

    mobile: boolean;
    featuredSellers: UserList[];
    user: UserAuth;

    @ViewChild('applyToSell', { static: true }) sellerModal: TemplatePortal<any>;

    constructor(private breakpointObserver: BreakpointObserver,
        private route: ActivatedRoute,
        private userService: UserService,
        private overlayService: OverlayService,
        private navigationService: NavigationService) { }

    ngOnInit() {
        this.user = this.userService.user$.value;
        this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
            this.mobile = result.matches;
        });
        this.featuredSellers = [
            {
                profileImageUrl: '../../../assets/images/influencer.jpeg',
                username: 'Influencer1',
                type: 'seller'
            },
            {
                profileImageUrl: '../../../assets/images/influencer.jpeg',
                username: 'Influencer2',
                type: 'seller'
            },
            {
                profileImageUrl: '../../../assets/images/influencer.jpeg',
                username: 'Influencer3',
                type: 'seller'
            },
            {
                profileImageUrl: '../../../assets/images/influencer.jpeg',
                username: 'Influencer4',
                type: 'seller'
            },
        ]
    }

    onSell() {
        this.overlayService.open(this.sellerModal);
    }

    onSignup() {
        this.navigationService.openAuthWindow({ page: 'signup' });
    }

    onClose(success: boolean) {
        this.overlayService.close();
    }
}
