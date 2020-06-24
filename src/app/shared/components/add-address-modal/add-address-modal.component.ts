import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Address } from '@app/shared/interfaces/address.interface';
import { State } from '@app/shared/services/lookup/state';
import { LookupService } from '@app/shared/services/lookup/lookup.service';
import { UserService } from '@app/shared/services/user/user.service';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { ShipmentService } from '@app/shared/services/shipment/shipment.service';
import { tap, mergeMap } from 'rxjs/operators';
import { iif, EMPTY } from 'rxjs';
import { AddressVerificationResponse } from '@app/shared/services/shipment/address-verification.response';
import { guid } from '../../utils/rand';

@Component({
  selector: 'app-add-address-modal',
  templateUrl: './add-address-modal.component.html',
  styleUrls: ['./add-address-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddAddressModalComponent implements OnInit {

  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<UserDetail> = new EventEmitter();
  @Output() saveAddress: EventEmitter<Address> = new EventEmitter();

  @Input() address: Address;
  @Input() user: UserDetail;
  @Input() title: string;

  loading = false;

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {
    if (!this.title) {
      if (this.address) {
        this.title = "Edit Address";
      } else {
        this.title = "Add an Address";
      }
    }
  }

  onClose() {
    this.close.emit();
  }

  onLoading(loading: boolean) {
    this.loading = loading;
    this.ref.markForCheck();
  }

  onSave(user: UserDetail) {
    this.save.emit(user);
    this.close.emit();
  }

  onSaveAddress(address: Address) {
    this.saveAddress.emit(address);
    this.close.emit();
  }
}
