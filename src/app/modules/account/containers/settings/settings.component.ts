import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UserService } from '@app/shared/services/user/user.service';
import { UserAuth } from '@app/shared/models/user-auth.model';
import { TemplatePortal } from '@angular/cdk/portal';
import { OverlayService } from '@app/shared/services/overlay.service';
import { VerificationError } from '@app/shared/services/user/verification-error';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {

  @ViewChild('verify', { static: true }) verifyModal: TemplatePortal<any>;
  @ViewChild('bank', { static: true }) bankModal: TemplatePortal<any>;
  @ViewChild('facebook', { static: true }) facebookModal: TemplatePortal<any>;
  @ViewChild('instagram', { static: true }) instagramModal: TemplatePortal<any>;

  currentUser: UserAuth;
  verficationClass: any;
  missingData: boolean;
  verification: VerificationError = null;
  allowClick: boolean;
  verificationStatus: string;
  bankAccountLinked = false;
  facebookLinked = false;
  instagramLinked = false;
  error: string;

  constructor(private userService: UserService,
    private overlayService: OverlayService,
    private navigationService: NavigationService,
    private ref: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.currentUser = this.userService.user$.value;
    this.verficationClass = {};
    if (this.currentUser.seller && this.currentUser.seller.verificationStatus !== 'verified' ||
      this.currentUser.seller.missingInfo.includes('external_account')) {
      this.error = `To start listing products you'll need to`;
      let verify = false;
      if (this.currentUser.seller.verificationStatus === 'unverified') {
        this.error = this.error + ' verify your identity';
        verify = true;
      }
      if (this.currentUser.seller.verificationStatus === 'review') {
        this.error = this.error + ' wait for your identity to be verified';
        verify = true;
      }
      if (this.currentUser.seller.missingInfo.includes('external_account')) {
        this.error = verify ? this.error + ' and' : this.error;
        this.error = this.error + ' link your bank acount';
      }
    }
    this.setView();
    this.navigationService.showNavBar(true, 'SETTINGS');
  }

  setView() {
    if (this.currentUser.type === 'seller') {
      if (!this.currentUser.seller.missingInfo.includes('external_account')) {
        this.bankAccountLinked = true;
      }
      switch (this.currentUser.seller.verificationStatus) {
        case 'unverified':
          this.allowClick = true;
          this.verificationStatus = 'Unverified';
          this.verficationClass.alert = true;
          break;
        case 'review':
          if (this.currentUser.seller.missingInfo &&
            (this.currentUser.seller.missingInfo.indexOf('external_acccount') === -1 || this.currentUser.seller.missingInfo.length > 1)) {
            this.allowClick = true;
            this.verification = {
              errors: this.currentUser.seller.errors,
              missingData: this.currentUser.seller.missingInfo
            };
            this.verificationStatus = 'Info Missing';
            this.verficationClass.alert = true;
          } else {
            this.verificationStatus = 'In Review';
            this.verficationClass.review = true;
            this.allowClick = false;
          }
          break;
        case 'rejected':
          this.verificationStatus = 'Rejected';
          this.allowClick = true;
          this.verficationClass.alert = true;
          break;
        case 'verified':
          this.verificationStatus = 'Verified';
          this.allowClick = false;
          this.verficationClass.success = true;
          break;
      }
    }
    console.log(this.currentUser.facebookUserId);
    if (this.currentUser) {
      this.facebookLinked = true;
    }
    if (this.currentUser.instagramUsername) {
      this.instagramLinked = true;
    }
    this.ref.markForCheck();
  }

  showVerifyModal() {
    if (this.allowClick) {
      this.overlayService.open(this.verifyModal);
    }
  }

  showBankAccountModal() {
    this.overlayService.open(this.bankModal);
  }

  close(event: any) {
    this.overlayService.close();
    this.currentUser = this.userService.currentUser;
    this.setView();
    this.ref.markForCheck();
  }

  linkFacebook() {
    this.overlayService.open(this.facebookModal);
  }

  linkInstagram() {
    this.overlayService.open(this.instagramModal);
  }

}
