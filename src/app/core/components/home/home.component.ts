import { Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
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
export class HomeComponent implements OnInit {

    mobile: boolean;
    featuredSellers: UserList[];
    user: UserAuth;
    submitted = false;

    @ViewChild('applyToSell', { static: true }) sellerModal: TemplatePortal<any>;

    constructor(private breakpointObserver: BreakpointObserver,
        private route: ActivatedRoute,
        private userService: UserService,
        private overlayService: OverlayService,
        private navigationService: NavigationService,
        private ref: ChangeDetectorRef) { }

    ngOnInit() {
        this.user = this.userService.user$.getValue();
        this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
            this.mobile = result.matches;
        });
        this.userService.getFeatured().subscribe(sellers => {
            this.featuredSellers = sellers;
            this.ref.markForCheck();
        })
        const theWindow = (window as any);
        theWindow.fnames = new Array(); theWindow.ftypes = new Array(); theWindow.fnames[0] = 'EMAIL'; theWindow.ftypes[0] = 'email';
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
    onShop() {
        this.navigationService.navigate({ path: '/products' })
    }

    onShopByInfluencer() {
        this.navigationService.navigate({ path: '/member/sellers' })
    }

    onSubmit() {
        this.submitted = true;
    }

    public onPrivacy() {
        this.navigationService.navigate({ path: '/member/privacy' })
    }

    onJoinMailingList(email: string) {
        this.userService.subscribe(email).subscribe(() => {
            this.submitted = true;
            this.ref.markForCheck();
        });
    }
}
