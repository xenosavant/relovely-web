import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@app/shared/services/user/user.service';
import { AuthService } from '@app/shared/services/auth/auth.service';

@Component({
  selector: 'app-instagram-auth',
  templateUrl: './instagram-auth.component.html',
  styleUrls: ['./instagram-auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstagramAuthComponent implements OnInit {

  private code: string;

  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.code = params['code'];
      if (this.code) {
        this.authService.signupWithInstagram(this.code).subscribe(response => {
          this.userService.setLogin(response.jwt, response.user);
          this.router.navigate(['/']);
        });
      } else {
        console.log('failed');
      }
    });
  }
}
