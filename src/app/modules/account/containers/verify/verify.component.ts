import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { UserService } from '@app/shared/services/user/user.service';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';

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
  public welcome = false;

  constructor(private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private navigationService: NavigationService,
    private userService: UserService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const code = params['code'];
      this.type = params['type'];
      if (this.type) {
        switch (this.type) {
          case 'email':
            if (code) {
              this.authService.verifyEmail({ code: code.replace(/ /g, '+') }).subscribe(response => {
                this.userService.setLogin(response.jwt, response.user);
                this.welcome = true;
                this.loading = false;
                this.ref.markForCheck();
              });
            } else {
              this.loading = false;
              this.ref.markForCheck();
            }
            break;
          case 'seller':
            if (code) {
              this.authService.verifyEmail({ code: code.replace(/ /g, '+') }).subscribe(response => {
                this.userService.setLogin(response.jwt, response.user);
                this.welcome = true;
                this.loading = false;
                this.ref.markForCheck();
              });
            } else {
              this.navigationService.navigate({ path: '/' });
            }
            break;
          default:
            this.message = 'A Verification email has been sent.';
            break;
        }
      } else {
        this.navigationService.navigate({ path: '/' });
      }
    });
  }

  goToProducts() {
    this.navigationService.navigate({ path: '/products' });
  }

  goToSettings() {
    this.navigationService.navigate({ path: '/account/settings' });
  }
}
