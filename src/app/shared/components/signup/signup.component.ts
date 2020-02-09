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

  public form: FormGroup;
  public url: string;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      verifyPassword: new FormControl('', [Validators.required])
    });
    this.url = environment.instagramAuthUrl + `&client_id=${environment.instagramClientId}&redirect_uri=${environment.instagramRedirectUrl}&scope=user_profile,user_media&response_type=code`;
  }

  signUpInstagram() {
    location.replace(this.url);
  }
}
