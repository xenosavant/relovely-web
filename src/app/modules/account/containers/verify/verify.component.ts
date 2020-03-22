import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { UserService } from '@app/shared/services/user/user.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyComponent implements OnInit {

  public message: string;
  public error = false;
  public type: string;
  public loading = true;

  constructor(private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const code = params['code'];
      this.type = params['type'];
      if (this.type) {
        switch (this.type) {
          case 'email':
            if (code) {
              console.log(code);
              this.authService.verifyEmail({ code: code.replace(/ /g, '+') }).subscribe(response => {
                this.userService.setLogin(response.jwt, response.user);
                this.router.navigate(['/']);
                this.loading = false;
              });
            } else {
              this.loading = false;
            }
            break;
          default:
            this.message = 'A Verification email has been sent.';
            break;
        }
      } else {
        this.router.navigate(['/']);
      }
    });
  }

}
