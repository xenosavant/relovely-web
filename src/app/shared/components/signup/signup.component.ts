import { Component, OnInit, ChangeDetectionStrategy, Sanitizer, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { UserService } from '@app/shared/services/user/user.service';
import { NavigationService } from '@app/shared/services/navigation.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnInit {

  public signInForm: FormGroup;
  public signUpForm: FormGroup;
  public signupInstagramUrl: string;
  public signinInstagramUrl: string;

  public emailError: string = null;
  public signinError: string = null;

  constructor(private sanitizer: DomSanitizer,
    private authService: AuthService,
    private userService: UserService,
    private navigationService: NavigationService,
    private zone: NgZone,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.signInForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    this.signUpForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      verifyPassword: new FormControl('', [Validators.required])
    });
    this.signupInstagramUrl = environment.instagramAuthUrl + `&client_id=${environment.instagramClientId}&redirect_uri=${environment.instagramSigninRedirectUrl}&scope=user_profile,user_media&response_type=code`;
    this.signinInstagramUrl = environment.instagramAuthUrl + `&client_id=${environment.instagramClientId}&redirect_uri=${environment.instagramSignupRedirectUrl}&scope=user_profile,user_media&response_type=code`;
  }

  signUpInstagram() {
    location.replace(this.signupInstagramUrl);
  }

  signInInstagram() {
    location.replace(this.signinInstagramUrl);
  }

  signup() {
    this.emailError = null;
    this.authService.signup({ email: this.signUpForm.value['email'], password: this.signUpForm.value['password'] })
      .subscribe(response => {
        this.userService.setLogin(response.jwt, response.user);
        this.navigationService.closeAuthWindow();
      }, err => {
        if (err.status === 409) {
          this.emailError = err.error.error.message;
          this.zone.run(() => {
            this.ref.detectChanges();
          });
        }
      });
  }

  signin() {
    this.signinError = null;
    this.authService.signin({ email: this.signInForm.value['email'], password: this.signInForm.value['password'] })
      .subscribe(response => {
        this.userService.setLogin(response.jwt, response.user);
        this.navigationService.closeAuthWindow();
      }, err => {
        if (err.status === 401) {
          this.signinError = 'Incorrect login credentials';
          this.zone.run(() => {
            this.ref.detectChanges();
          });
        }
      });
  }
}
