import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { UserService } from '@app/shared/services/user/user.service';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';

@Component({
  selector: 'app-facebook-auth',
  templateUrl: './facebook-auth.component.html',
  styleUrls: ['./facebook-auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacebookAuthComponent implements OnInit {

  private code: string;
  loading = true;

  constructor(private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private navigationService: NavigationService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.code = params['code'];
      const type = params['type'];
      if (this.code) {
        switch (type) {
          case 'link':
            this.authService.linkFacebook(this.code).subscribe(user => {
              this.userService.setCurrentUser(user);
              this.router.navigate(['/account/settings']);
            }, err => {
              this.router.navigate(['/account/settings'], { queryParams: { error: err.error.error.message } });
            });
            break;
          default:
            this.authService.continueWithFacebook(this.code).subscribe(response => {
              this.userService.setLogin(response.jwt, response.user);
              if (response.existing) {
                this.router.navigate(['/account/facebook']);
              } else {
                this.loading = false;
                this.ref.markForCheck();
              }
            }, err => {
              this.router.navigate(['/']);
              this.navigationService.openAuthWindow({ error: err.error.error.message, page: 'signin' });
            });
            break;
        }
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  goToProducts() {
    this.navigationService.navigate({ path: '/products' });
  }

}
