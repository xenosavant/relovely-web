import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { State } from '@app/shared/services/lookup/state';
import { LookupService } from '@app/shared/services/lookup/lookup.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '@app/shared/services/user/user.service';

@Component({
  selector: 'app-seller-apply',
  templateUrl: './seller-apply.component.html',
  styleUrls: ['./seller-apply.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SellerApplyComponent implements OnInit {

  @Output() close: EventEmitter<boolean> = new EventEmitter();

  states: State[];
  error: string;
  public form: FormGroup;
  loading = false;
  success = false;

  constructor(private lookupService: LookupService,
    private userService: UserService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.states = this.lookupService.states;
    this.form = new FormGroup({
      first: new FormControl('', [Validators.required]),
      last: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      line1: new FormControl('', [Validators.required]),
      line2: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      zip: new FormControl('', [Validators.required]),
      insta: new FormControl('', [Validators.required]),
      channel1: new FormControl(''),
      channel2: new FormControl(''),
      channel3: new FormControl(''),
    });
  }

  onSave() {
    this.loading = true;
    this.userService.applyToSell({
      firstName: this.form.get('first').value,
      lastName: this.form.get('last').value,
      email: this.form.get('email').value,
      address: {
        line1: this.form.get('line1').value,
        line2: this.form.get('line2').value,
        city: this.form.get('city').value,
        state: this.form.get('state').value,
        zip: this.form.get('zip').value,
        country: 'US'
      },
      instagramUsername: this.form.get('insta').value,
      channel1: this.form.get('channel1').value,
      channel2: this.form.get('channel2').value,
      channel3: this.form.get('channel3').value,
    }).subscribe(() => {
      this.success = true;
      this.loading = false;
      this.ref.markForCheck();
    }, err => {
      this.loading = false;
      this.error = err.error.error.message;
      this.ref.markForCheck();
    })
  }

  onCancel() {
    this.close.emit(false);
  }

  onClose() {
    this.close.emit(true);
  }

}
