import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Address } from '@app/shared/interfaces/address.interface';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { guid } from '@app/shared/utils/rand';
import { tap, mergeMap } from 'rxjs/operators';
import { AddressVerificationResponse } from '@app/shared/services/shipment/address-verification.response';
import { iif, EMPTY } from 'rxjs';
import { State } from '@app/shared/services/lookup/state';
import { LookupService } from '@app/shared/services/lookup/lookup.service';
import { UserService } from '@app/shared/services/user/user.service';
import { ShipmentService } from '@app/shared/services/shipment/shipment.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddAddressComponent implements OnInit {

  @Input() address: Address;
  @Input() user: UserDetail;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() loading: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<UserDetail> = new EventEmitter();


  public form: FormGroup;
  edit = false;
  title: string;
  states: State[];
  index: number;
  errors: string[];
  message: string;
  override = false;

  constructor(private lookupService: LookupService,
    private userService: UserService,
    private shipmentService: ShipmentService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.states = this.lookupService.states;

    if (this.address) {
      this.form = new FormGroup({
        name: new FormControl(this.address.name, [Validators.required]),
        line1: new FormControl(this.address.line1, [Validators.required]),
        line2: new FormControl(this.address.line2),
        city: new FormControl(this.address.city, [Validators.required]),
        state: new FormControl(this.address.state, [Validators.required]),
        zip: new FormControl(this.address.zip, [Validators.required, Validators.maxLength(5)]),
      });
      this.edit = true;
      this.index = this.user.addresses.indexOf(this.address);
    } else {
      this.form = new FormGroup({
        name: new FormControl('', [Validators.required]),
        line1: new FormControl('', [Validators.required]),
        line2: new FormControl(''),
        city: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        zip: new FormControl('', [Validators.required, Validators.maxLength(5)]),
      });
    }
  }

  onClose() {
    this.close.emit();
  }

  onSave() {
    this.loading.emit(true);
    const saveAddress: Address = {
      name: this.form.get('name').value,
      line1: this.form.get('line1').value,
      line2: this.form.get('line2').value,
      city: this.form.get('city').value,
      state: this.form.get('state').value,
      zip: this.form.get('zip').value,
      country: 'US',
      id: guid()
    }
    let update;
    if (this.edit) {
      saveAddress.primary = this.address.primary;
      this.user.addresses.splice(this.index, 1, saveAddress);
      update = this.user.addresses;
    } else {
      saveAddress.primary = !this.user.addresses.length ? true : false;
      update = [...this.user.addresses, saveAddress];
    }
    if (!this.override) {
      this.shipmentService.verifyAddress(saveAddress).pipe(tap(val => {
        if (val.success) {
          this.address = val.correctedAddress ? {
            line1: val.correctedAddress.line1,
            line2: val.correctedAddress.line2,
            city: val.correctedAddress.city,
            state: val.correctedAddress.state,
            zip: val.correctedAddress.zip,
            country: 'US'
          } : update;
          this.errors = val.errors || [];
          this.message = val.correctedAddress ? 'This address looks like a better match' : null;
          this.updateFormFields();
          this.loading.emit(false);
          this.ref.markForCheck();
        } else {
          this.override = true;
          this.message = `This address doesn't look quite right. If you're sure it's correct click save`;
          this.loading.emit(false);
          this.ref.markForCheck();
        }
      }), mergeMap((v: AddressVerificationResponse) =>
        iif(() => (!v.errors && !v.correctedAddress && v.success),
          this.userService.updateUser(this.user.id, { addresses: update }), EMPTY)))
        .subscribe(user => {
          this.save.emit(this.user);
        }, err => {
          this.loading.emit(false);
        })
    } else {
      this.userService.updateUser(this.user.id, { addresses: update })
        .subscribe(user => {
          this.save.emit(this.user);
        }, err => {
          this.loading.emit(false);
        })
    }
  }

  updateFormFields() {
    this.form.get('line1').setValue(this.address.line1);
    this.form.get('line2').setValue(this.address.line2);
    this.form.get('city').setValue(this.address.city);
    this.form.get('state').setValue(this.address.state);
    this.form.get('zip').setValue(this.address.zip);
  }

}
