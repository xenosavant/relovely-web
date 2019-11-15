import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { OverlayService } from '@app/shared/services/overlay.service';
import { NavigationService } from '@app/shared/services/navigation.service';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressesComponent implements OnInit {

  @ViewChild('addAddressModal', { static: true }) addAddressModal: TemplatePortal<any>;

  constructor(private overlayService: OverlayService, private navigationService: NavigationService) { }

  ngOnInit() {
    this.navigationService.showNavBar(true, 'Addresses');
  }

  openModal() {
    this.overlayService.open(this.addAddressModal);
  }

  close() {
    this.overlayService.close();
  }
}
