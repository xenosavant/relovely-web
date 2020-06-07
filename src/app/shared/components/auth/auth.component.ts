import { Component, OnInit, ChangeDetectionStrategy, Sanitizer, NgZone, ChangeDetectorRef, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { environment } from '@env/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { UserService } from '@app/shared/services/user/user.service';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent implements OnChanges {

  public signInForm: FormGroup;
  public signUpForm: FormGroup;
  public sellerForm: FormGroup;
  public resetForm: FormGroup;
  public signupInstagramUrl: string;
  public signinInstagramUrl: string;
  public signupFacebookUrl: string;
  public signinFacebookUrl: string;
  private originalResetText = 'Enter your email below to reset your password:';

  public loading = false;
  public title: string;
  public resetText = this.originalResetText;

  @Input()
  error: string;

  @Input()
  public state: 'signin' | 'signup' | 'reset' | 'sell' = 'signin';

  constructor(private sanitizer: DomSanitizer,
    private authService: AuthService,
    private userService: UserService,
    private navigationService: NavigationService,
    private zone: NgZone,
    private ref: ChangeDetectorRef,
    private router: Router) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.state && !!changes.state.currentValue) {
      console.log(changes.state.currentValue);
      this.goTo(changes.state.currentValue);
      this.signInForm = new FormGroup({
        email: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
      });
      this.sellerForm = new FormGroup({
        email: new FormControl('', [Validators.email, Validators.required])
      });
      this.signUpForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        verifyPassword: new FormControl('', [Validators.required])
      }, this.validatePassword);
      this.resetForm = new FormGroup({
        identifier: new FormControl('', [Validators.required])
      });
      this.signupInstagramUrl = environment.instagramAuthUrl +
        `&client_id=${environment.instagramClientId}&redirect_uri=${environment.instagramSignupRedirectUrl}`;
      this.signupFacebookUrl = environment.facebookAuthUrl + `?client_id=${environment.facebookClientId}&redirect_uri=${environment.facebookSignupRedirectUrl}&scope=email&response_type=code`;
      this.signinFacebookUrl = environment.facebookAuthUrl + `?client_id=${environment.facebookClientId}&redirect_uri=${environment.facebookSigninRedirectUrl}&response_type=code`;
      this.ref.markForCheck();
    }

  }

  signUpInstagram() {
    this.loading = true;
    const url = this.signupInstagramUrl + `&state=` + this.sellerForm.get('email').value;
    location.replace(url);
  }

  signUpFacebook() {
    location.replace(this.signupFacebookUrl);
  }

  signInFacebook() {
    location.replace(this.signinFacebookUrl);
  }

  signup() {
    this.error = null;
    this.loading = true;
    this.authService.signup({ email: this.signUpForm.value['email'], password: this.signUpForm.value['password'], username: this.signUpForm.value['username'] })
      .subscribe(response => {
        this.router.navigate(['/account/verify'], { queryParams: { type: 'email' } });
        this.loading = false;
        this.navigationService.closeAuthWindow();
      }, err => {
        if (err.status === 409) {
          this.error = err.error.error.message;
          this.loading = false;
          this.zone.run(() => {
            this.ref.detectChanges();
            this.loading = false;
          });
        }
      });
  }

  signin() {
    this.error = null;
    this.loading = true;
    this.authService.signin({ email: this.signInForm.value['email'], password: this.signInForm.value['password'] })
      .subscribe(response => {
        this.userService.setLogin(response.jwt, response.user);
        this.router.navigate(['/'], { queryParams: { type: 'email' } });
        this.navigationService.closeAuthWindow();
        this.loading = false;
      }, (err) => {
        if (err.status === 403) {
          this.error = err.error.error.message,
            this.loading = false;
          this.zone.run(() => {
            this.ref.detectChanges();
          });
        }
      });
  }

  reset() {
    this.loading = true;
    this.authService.emailPasswordReset({ identifier: this.signInForm.value['identifier'] as string })
      .subscribe(response => {
        this.navigationService.closeAuthWindow();
        this.loading = false;
        this.router.navigate(['/account/reset-password'])
      }, err => {

      });
  }

  forgot() {
    this.state = 'reset';
    this.title = 'RESET PASSWORD';
  }

  goTo(state) {
    this.error = null;
    this.state = state;
    switch (this.state) {
      case ('signin'):
        this.title = 'SIGN IN';
        break;
      case ('signup'):
        this.title = 'SIGN UP';
        break;
      case ('reset'):
        this.title = 'RESET PASSWORD';
        break;
      case ('sell'):
        this.title = 'APPLY TO SELL';
        break;
    }
  }

  close() {
    this.navigationService.closeAuthWindow();
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
    return this.signUpForm.get('password').value;
  }

  get passwordVerifyValue() {
    return this.signUpForm.get('verifyPassword').value;
  }

  goToTerms() {
    this.close();
    this.navigationService.navigate({ path: '/member/terms' });
  }

  goToPrivacy() {
    this.close();
    this.navigationService.navigate({ path: '/member/privacy' });
  }
}
