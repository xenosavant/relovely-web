import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { UserService } from '@app/shared/services/user/user.service';

@Component({
  selector: 'app-facebook-auth',
  templateUrl: './facebook-auth.component.html',
  styleUrls: ['./facebook-auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacebookAuthComponent implements OnInit {

  private code: string;

  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.code = params['code'];
      const type = params['type'];
      if (this.code && type) {
        switch (type) {
          case 'signin':
            this.authService.signinWithFacebook(this.code).subscribe(response => {
              this.userService.setLogin(response.jwt, response.user);
              this.router.navigate(['/']);
            });
            break;
          case 'signup':
            this.authService.signupWithFacebook(this.code).subscribe(response => {
              this.userService.setLogin(response.jwt, response.user);
              this.router.navigate(['/']);
            });
            break;
        }
      } else {
        this.router.navigate(['/']);
      }
    });
  }

}
