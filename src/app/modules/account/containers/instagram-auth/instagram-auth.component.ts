import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@app/shared/services/user/user.service';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { Subject, Subscription, combineLatest } from 'rxjs';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-instagram-auth',
  templateUrl: './instagram-auth.component.html',
  styleUrls: ['./instagram-auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstagramAuthComponent implements OnInit {

  private code: string;
  private type: string;
  loading = true;
  saving = false;
  success = false;
  error: string;
  form: FormGroup = new FormGroup({ email: new FormControl('', [Validators.required]) });

  constructor(private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private navigationService: NavigationService,
    private router: Router,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    combineLatest([this.activatedRoute.queryParams, this.activatedRoute.params]).subscribe(([query, route]) => {
      this.type = route['type'];
      this.code = query['code'];
      if (this.code && this.type) {
        if (this.type === 'seller' || this.type === 'member') {
          this.loading = false;
        } else {
          this.router.navigate(['/']);
        }
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit() {
    this.saving = true;
    this.error = null;
    if (this.type === 'member') {
      this.authService.signupWithInstagram(this.form.get('email').value, this.code).subscribe(() => {
        this.success = true;
        this.saving = false;
        this.ref.markForCheck();
      }, err => {
        this.error = err.error.error.message;
        this.saving = false;
        this.ref.markForCheck();
      });
    }
    else if (this.type === 'seller') {
      this.authService.sellWithInstagram(this.form.get('email').value, this.code).subscribe(() => {
        this.success = true;
        this.saving = false;
        this.ref.markForCheck();
      }, err => {
        this.error = err.error.error.message;
        this.saving = false;
        this.ref.markForCheck();
      });
    }
  }
  // this.activatedRoute.queryParams.subscribe(params => {
  //   const type = this.activatedRoute.params.
  //   const code = params['code'];
  //   const email = params['state'];
  //   console.log(email);
  //   console.log(code);
  // if (this.code && this.type) {
  //   if (this.type === 'seller') {
  //     this.authService.sellWithInstagram(email, this.code).subscribe(() => {
  //       this.loading = false;
  //       this.ref.markForCheck();
  //     }, err => {
  //       this.loading = false;
  //       this.router.navigate(['/']);
  //       this.navigationService.openAuthWindow({ error: err.error.error.message, page: 'sell' });
  //     });
  //   }
  //   if (this.type === 'member') {
  //     this.authService.signupWithInstagram(email, this.code).subscribe(() => {
  //       this.loading = false;
  //       this.ref.markForCheck();
  //     }, err => {
  //       this.loading = false;
  //       this.router.navigate(['/']);
  //       this.navigationService.openAuthWindow({ error: err.error.error.message, page: 'instagram' });
  //     });
  //   }
  // } else {
  //   this.router.navigate(['/']);
  // }
}
