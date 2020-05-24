import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UserService } from '@app/shared/services/user/user.service';
import { UserAuth } from '@app/shared/models/user-auth.model';
import { TemplatePortal } from '@angular/cdk/portal';
import { OverlayService } from '@app/shared/services/overlay.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {

  @ViewChild('verify', { static: true }) verifyModal: TemplatePortal<any>;
  @ViewChild('bank', { static: true }) bankModal: TemplatePortal<any>;

  currentUser: UserAuth;
  verficationClass: any;

  constructor(private userService: UserService,
    private overlayService: OverlayService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.currentUser = this.userService.currentUser;
    this.verficationClass = {
      alert: this.currentUser.seller.verificationStatus === 'unverified' || this.currentUser.seller.verificationStatus === 'rejected',
      review: this.currentUser.seller.verificationStatus === 'review',
      success: this.currentUser.seller.verificationStatus === 'verified',
    };
  }

  showVerifyModal() {
    this.overlayService.open(this.verifyModal);
  }

  showBankAccountModal() {
    this.overlayService.open(this.bankModal);
  }

  close(event: any) {
    this.overlayService.close();
    this.currentUser = this.userService.currentUser;
    this.ref.markForCheck();
  }

}
