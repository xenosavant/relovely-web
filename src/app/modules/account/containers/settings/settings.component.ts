import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UserService } from '@app/shared/services/user/user.service';
import { UserAuth } from '@app/shared/models/user-auth.model';
import { TemplatePortal } from '@angular/cdk/portal';
import { OverlayService } from '@app/shared/services/overlay.service';
import { VerificationError } from '@app/shared/services/user/verification-error';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { ActivatedRoute } from '@angular/router';
import { Address } from '@app/shared/interfaces/address.interface';

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
  @ViewChild('address', { static: true }) addressModal: TemplatePortal<any>;

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
  message: string;
  returnAddress: Address;
  completed: boolean;

  constructor(private userService: UserService,
    private overlayService: OverlayService,
    private navigationService: NavigationService,
    private ref: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.currentUser = this.userService.user$.getValue();
    this.returnAddress = this.currentUser.returnAddress;
    if (!this.currentUser) {
      this.navigationService.navigate({ 'path': '/' })
      this.navigationService.openAuthWindow({ page: 'signin' });
    }
    this.verficationClass = {};
    this.setErrors();
    this.setView();
    this.navigationService.showNavBar(true, 'SETTINGS');
  }

  setErrors() {
    if (this.currentUser.seller && this.currentUser.seller.verificationStatus !== 'verified' ||
      this.currentUser.seller && (this.currentUser.seller.missingInfo.includes('external_account')) ||
      !this.currentUser.returnAddress) {
      this.message = `Once you`;
      let verify = false;
      if (this.currentUser.seller.verificationStatus === 'unverified') {
        this.message = this.message + ' verify your identity';
        verify = true;
      }
      else if (this.currentUser.seller.missingInfo.length > 0 &&
        (this.currentUser.seller.missingInfo.indexOf('external_account') === -1 || this.currentUser.seller.missingInfo.length > 1)) {
        this.message = this.message + ' provide a bit more information to verify your identity';
        verify = true;
      }
      else if (this.currentUser.seller.verificationStatus === 'review') {
        this.message = this.message + ' identity is verified';
        verify = true;
      }
      if (this.currentUser.seller.missingInfo.includes('external_account')) {
        this.message = verify ? this.message + ' and' : this.message;
        this.message = this.message + ' you link your bank acount';
      }
      if (!this.currentUser.returnAddress) {
        this.message = verify ? this.message + ' and ' : this.message;
        this.message = this.message + ' provide a return shipping address';
      }
      this.message = this.message + ', you can start uploading products in your profile.'
    } else {
      this.message = `You're all set! You can start you can start uploading products in your profile.`;
      this.completed = true;
    }
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
          this.verficationClass = { alert: true };
          break;
        case 'review':
          if (this.currentUser.seller.missingInfo.length > 0 &&
            (this.currentUser.seller.missingInfo.indexOf('external_account') === -1 || this.currentUser.seller.missingInfo.length > 1)) {
            this.allowClick = true;
            this.verification = {
              errors: this.currentUser.seller.errors,
              missingData: this.currentUser.seller.missingInfo
            };
            this.verificationStatus = 'Add Info';
            this.verficationClass.alert = true;
          } else {
            this.verificationStatus = 'In Review';
            this.verficationClass = { review: true }
            this.allowClick = false;
          }
          break;
        case 'rejected':
          this.verificationStatus = 'Rejected';
          this.allowClick = true;
          this.verficationClass = { alert: true };
          break;
        case 'verified':
          this.verificationStatus = 'Verified';
          this.allowClick = false;
          this.verficationClass.success = true;
          break;
      }
    }
    if (this.currentUser.facebookUserId) {
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

  showAddressModal() {
    this.overlayService.open(this.addressModal);
  }

  showBankAccountModal() {
    this.overlayService.open(this.bankModal);
  }

  close(event: any) {
    this.overlayService.close();
    this.currentUser = this.userService.user$.getValue();
    this.setErrors();
    this.setView();
    this.ref.markForCheck();
  }

  linkFacebook() {
    this.overlayService.open(this.facebookModal);
  }

  linkInstagram() {
    this.overlayService.open(this.instagramModal);
  }

  onSaveAddress(address: Address) {
    this.userService.updateUser(this.currentUser.id, { returnAddress: address }).subscribe(result => {
      this.returnAddress = address;
      this.ref.markForCheck();
    })
  }

}
