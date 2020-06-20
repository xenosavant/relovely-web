import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { UserService } from '@app/shared/services/user/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-bank',
  templateUrl: './add-bank.component.html',
  styleUrls: ['./add-bank.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddBankComponent implements OnInit {

  @Output() close: EventEmitter<any> = new EventEmitter;
  form: FormGroup;
  loading: boolean = false;
  error: string;

  constructor(private ref: ChangeDetectorRef,
    private userService: UserService) { }

  ngOnInit() {
    this.form = new FormGroup({
      first: new FormControl('', [Validators.required]),
      last: new FormControl('', [Validators.required]),
      account: new FormControl('', [Validators.required]),
      routing: new FormControl('', [Validators.required]),
    });
  }

  onClose(event: any) {
    this.close.emit();
  }

  onSave() {
    this.loading = true;
    this.userService.addBank({
      routingNumber: this.form.get('routing').value,
      accountNumber: this.form.get('account').value,
      firstName: this.form.get('first').value,
      lastName: this.form.get('last').value
    }).subscribe(user => {
      console.log(user);
      this.userService.setCurrentUser(user);
      this.loading = false;
      this.close.emit();
    }, err => {
      this.error = err.error.error.message;
      this.loading = false;
      this.ref.markForCheck();
    });
  }

}
