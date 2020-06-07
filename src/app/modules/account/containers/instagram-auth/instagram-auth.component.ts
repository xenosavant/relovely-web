import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@app/shared/services/user/user.service';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';

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
    this.activatedRoute.queryParams.subscribe(params => {
      this.code = params['code'];
      this.type = params['type'];
      console.log(this.code);
      console.log(this.type);
      const email = params['state'];
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
    });
  }
}
