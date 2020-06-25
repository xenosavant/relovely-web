import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { UserService } from '@app/shared/services/user/user.service';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent implements OnInit {

  public loading = true;
  public form: FormGroup;
  public code: string;
  public showForm = false;
  public error = false;
  public success = false;

  constructor(private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.form = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      verifyPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    }, this.validatePassword);
    this.code = this.activatedRoute.snapshot.queryParams['code'];
    if (this.code) {
      this.showForm = true;
    }
    this.loading = false;
  }

  submit() {
    this.loading = true;
    this.authService.resetPassword({
      code: this.code,
      password: this.form.value['password']
    }).subscribe(response => {
      this.showForm = false;
      this.loading = false;
      this.success = true;
      this.ref.markForCheck();
    }, err => {
      this.error = true;
      this.showForm = false;
      this.loading = false;
      this.ref.markForCheck();
    });
  }

  validatePassword(control: FormGroup): ValidationErrors {
    const password = control.get('password').value;
    const verify = control.get('verifyPassword').value;
    if (!password || !verify) {
      return null;
    } else if (password === verify) {
      return null;
    } else {
      return { passwordMatch: `Passwords don't match` }
    }
  }

  get passwordValue() {
    return this.form.get('password').value;
  }

  get passwordVerifyValue() {
    return this.form.get('verifyPassword').value;
  }


}
