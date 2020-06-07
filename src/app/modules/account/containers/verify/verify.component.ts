import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { UserService } from '@app/shared/services/user/user.service';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyComponent implements OnInit {

  public message: string;
  public error = false;
  public type: string;
  public loading = true;
  public welcome = false;
  public code: string;
  form: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required]),
    verifyPassword: new FormControl('', [Validators.required])
  }, this.validatePassword);

  constructor(private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private navigationService: NavigationService,
    private userService: UserService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.code = params['code'];
      this.type = params['type'];
      if (this.type) {
        switch (this.type) {
          case 'email':
            if (this.code) {
              this.loading = false;
            } else {
              this.loading = false;
              this.ref.markForCheck();
            }
            break;
          case 'seller':
            if (this.code) {
              this.loading = false;
              this.ref.markForCheck();
            } else {
              this.navigationService.navigate({ path: '/' });
              this.loading = false;
              this.ref.markForCheck();
            }
            break;
          case 'member':
            if (this.code) {
              this.loading = false;
              this.ref.markForCheck();
            } else {
              this.navigationService.navigate({ path: '/' });
              this.loading = false;
              this.ref.markForCheck();
            }
            break;
          default:
            this.message = 'A Verification email has been sent.';
            break;
        }
      } else {
        this.navigationService.navigate({ path: '/' });
      }
    });
  }

  get passwordValue() {
    return this.form.get('password').value;
  }

  get passwordVerifyValue() {
    return this.form.get('verifyPassword').value;
  }

  goToProducts() {
    this.navigationService.navigate({ path: '/products' });
  }

  goToSettings() {
    this.navigationService.navigate({ path: '/account/settings' });
  }

  onSavePassword() {
    this.loading = true;
    this.authService.verifyEmail({ code: this.code }).subscribe(response => {
      this.authService.resetPassword({ password: this.passwordValue, code: this.code }).subscribe(user => {
        this.userService.setLogin(response.jwt, response.user);
        this.welcome = true;
        this.loading = false;
        this.ref.markForCheck();
      }, error => {
        console.log(error);
        this.loading = false;
      });
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


}
