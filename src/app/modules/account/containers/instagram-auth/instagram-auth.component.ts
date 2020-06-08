import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@app/shared/services/user/user.service';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { Subject, Subscription, combineLatest } from 'rxjs';

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

  constructor(private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private navigationService: NavigationService,
    private router: Router,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    combineLatest([this.activatedRoute.queryParams, this.activatedRoute.params]).subscribe(([query, route]) => {
      const type = route['type'];
      const code = query['code'];
      const state = query['state'];
      console.log(type, code, state);
    });
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
}
