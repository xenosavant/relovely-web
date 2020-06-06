import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
    private navigationService: NavigationService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.code = params['code'];
      const type = params['type'];
      if (this.code && type) {
        switch (type) {
          case 'signin':
            this.authService.signinWithFacebook(this.code).subscribe(response => {
              console.log(response);
              this.userService.setLogin(response.jwt, response.user);
              this.router.navigate(['/']);
            }, err => {
              this.loading = false;
              this.router.navigate(['/']);
              this.navigationService.openAuthWindow({ error: err.error.error.message, page: 'signin' });
            });
            break;
          case 'signup':
            this.authService.signupWithFacebook(this.code).subscribe(response => {
              this.userService.setLogin(response.jwt, response.user);
              this.router.navigate(['/']);
            }, err => {
              this.loading = false;
              this.router.navigate(['/']);
              this.navigationService.openAuthWindow({ error: err.error.error.message, page: 'signup' });
            });
            break;
        }
      } else {
        this.router.navigate(['/']);
      }
    });
  }

}
