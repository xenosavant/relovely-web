import { Component, OnInit, ChangeDetectionStrategy, Sanitizer } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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

  constructor(private sanitizer: DomSanitizer) { }

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
}
