import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Address } from '@app/shared/interfaces/address.interface';
import { State } from '@app/shared/services/lookup/state';
import { LookupService } from '@app/shared/services/lookup/lookup.service';
import { UserService } from '@app/shared/services/user/user.service';
import { UserDetail } from '@app/shared/models/user-detail.model';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddAddressComponent implements OnInit {

  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<UserDetail> = new EventEmitter();

  @Input() address: Address;
  @Input() user: UserDetail;


  public form: FormGroup;
  edit = false;
  title: string;
  states: State[];
  index: number;

  constructor(private lookupService: LookupService, private userService: UserService) { }

  ngOnInit() {
    this.states = this.lookupService.states;
    if (this.address) {
      this.form = new FormGroup({
        name: new FormControl(this.address.name, [Validators.required]),
        line1: new FormControl(this.address.line1, [Validators.required]),
        line2: new FormControl(this.address.line2, [Validators.required]),
        city: new FormControl(this.address.city, [Validators.required]),
        state: new FormControl(this.address.state, [Validators.required]),
        zip: new FormControl(this.address.zip, [Validators.required, Validators.maxLength(5)]),
      });
      this.title = "Edit Address";
      this.edit = true;
      this.index = this.user.addresses.indexOf(this.address);
      console.log(this.index);
    } else {
      this.form = new FormGroup({
        name: new FormControl('', [Validators.required]),
        line1: new FormControl('', [Validators.required]),
        line2: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        zip: new FormControl('', [Validators.required, Validators.maxLength(5)]),
      });
      this.title = "Add an Address";
    }
  }

  onClose(event) {
    this.close.emit(event);
  }

  onSave() {
    const saveAddress: Address = {
      name: this.form.get('name').value,
      line1: this.form.get('line1').value,
      line2: this.form.get('line2').value,
      city: this.form.get('city').value,
      state: this.form.get('state').value,
      zip: this.form.get('zip').value,
      country: 'US'
    }
    let update;
    if (this.edit) {
      saveAddress.primary = this.address.primary;
      this.user.addresses.splice(this.index, 1, saveAddress);
      update = this.user.addresses;
    } else {
      saveAddress.primary = !this.user.addresses.length ? true : false;
      console.log(saveAddress);
      update = [...this.user.addresses, saveAddress];
    }
    this.userService.updateUser(this.user.id, { addresses: update }).subscribe(user => {
      this.save.emit(this.user);
      this.close.emit(true);
    }, err => {
      console.log(err);
    })
  }
}
