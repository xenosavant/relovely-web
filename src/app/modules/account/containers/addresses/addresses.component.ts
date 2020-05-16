import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { OverlayService } from '@app/shared/services/overlay.service';
import { NavigationService } from '@app/shared/services/navigation.service';
import { TemplatePortal } from '@angular/cdk/portal';
import { BreakpointObserver } from '@angular/cdk/layout';
import { UserService } from '@app/shared/services/user/user.service';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { Address } from '@app/shared/interfaces/address.interface';
import { UserAuth } from '@app/shared/models/user-auth.model';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressesComponent implements OnInit {

  @ViewChild('addAddressModal', { static: true }) addAddressModal: TemplatePortal<any>;
  public mobile: boolean = false;

  user: UserAuth;
  addresses: Address[];
  editAddress: Address;
  loading = true;
  primary: Address;

  constructor(private overlayService: OverlayService,
    private navigationService: NavigationService,
    private breakpointObserver: BreakpointObserver,
    private ref: ChangeDetectorRef,
    private userService: UserService) { }

  ngOnInit() {
    this.navigationService.showNavBar(true, 'Addresses');
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.mobile = result.matches;
      this.ref.markForCheck();
    });

    this.userService.getCurrentUser().then(user => {
      this.user = user;
      this.addresses = [...this.user.addresses];
      this.primary = this.addresses.find(address => {
        return address.primary;
      })
      this.loading = false;
      this.ref.markForCheck();
    })
  }

  openModal() {
    this.editAddress = null;
    this.overlayService.open(this.addAddressModal);
  }

  close() {
    this.overlayService.close();
  }

  onSaved(user: UserAuth) {
    this.user = user;
    this.addresses = [...this.user.addresses];
    this.ref.markForCheck();
  }

  edit(address: Address) {
    this.editAddress = address;
    this.overlayService.open(this.addAddressModal);
  }
}
