import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LookupService } from '@app/shared/services/lookup/lookup.service';
import { State } from '@app/shared/services/lookup/state';
import { UserService } from '@app/shared/services/user/user.service';

@Component({
  selector: 'app-verify-seller',
  templateUrl: './verify-seller.component.html',
  styleUrls: ['./verify-seller.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifySellerComponent implements OnInit {

  @Output() close: EventEmitter<any> = new EventEmitter;

  states: State[];
  form: FormGroup;
  error: string = null;
  loading: boolean = false;
  tosAccept: number;

  constructor(private lookupService: LookupService, private userService: UserService) { }

  ngOnInit() {
    this.states = this.lookupService.states;
    this.form = new FormGroup({
      first: new FormControl('', [Validators.required]),
      last: new FormControl('', [Validators.required]),
      birthday: new FormControl(null, [Validators.required]),
      ssn: new FormControl(null, [Validators.required, Validators.minLength(11)]),
      phone: new FormControl('', [Validators.required, Validators.minLength(12)]),
      line1: new FormControl('', [Validators.required]),
      line2: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      zip: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      country: new FormControl({ value: 'United States', disabled: true }, [Validators.required]),
      tos: new FormControl(null, [Validators.requiredTrue]),
    })
    this.form.get('tos').valueChanges.subscribe(val => {
      if (val === true) {
        this.tosAccept = Math.floor(Date.now() / 1000);
      }
    });
  }

  onClose(event: any) {
    this.close.emit();
  }

  onSave() {
    const birth = (this.form.get('birthday').value as Date);
    this.loading = true;
    this.userService.verifySeller({
      firstName: this.form.get('first').value,
      lastName: this.form.get('last').value,
      birthDay: birth.getDate(),
      birthMonth: birth.getMonth(),
      birthYear: birth.getFullYear(),
      phone: this.form.get('phone').value.replace(/-/g, ''),
      email: this.form.get('email').value,
      ssn: this.form.get('ssn').value.replace(/-/g, ''),
      tosAcceptDate: this.tosAccept,
      address: {
        city: this.form.get('city').value,
        state: this.form.get('state').value,
        zip: this.form.get('zip').value,
        line1: this.form.get('line1').value,
        line2: this.form.get('line2').value,
        country: 'US'
      }
    }).subscribe(response => {
      this.loading = false;
      this.close.emit();
    }, err => {
      this.loading = false;
      this.error = err.error.error;
      console.log(err);
    });
  }

}
