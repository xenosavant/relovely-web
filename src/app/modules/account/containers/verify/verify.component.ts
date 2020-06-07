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
      const code = params['code'];
      this.type = params['type'];
      if (this.type) {
        switch (this.type) {
          case 'email':
            if (code) {
              this.authService.verifyEmail({ code: code.replace(/ /g, '+') }).subscribe(response => {
                this.userService.setLogin(response.jwt, response.user);
                this.welcome = true;
                this.loading = false;
                this.ref.markForCheck();
              });
            } else {
              this.loading = false;
              this.ref.markForCheck();
            }
            break;
          case 'seller':
            if (code) {
              this.authService.verifyEmail({ code: code.replace(/ /g, '+') }).subscribe(response => {
                this.userService.setLogin(response.jwt, response.user);
                this.loading = false;
                this.ref.markForCheck();
              });
            } else {
              this.navigationService.navigate({ path: '/' });
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
    this.authService.resetPassword(this.passwordValue).subscribe(user => {
      this.welcome = true;
    }, error => {
      console.log(error);
    })
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
