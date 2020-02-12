import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@app/shared/services/user/user.service';

@Component({
  selector: 'app-instagram-auth',
  templateUrl: './instagram-auth.component.html',
  styleUrls: ['./instagram-auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstagramAuthComponent implements OnInit {

  private code: string;

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.code = params['code'];
      if (this.code) {
        this.userService.signupWithInstagram(this.code).subscribe(result => {
          console.log(result);
        });
      } else {
        console.log('failed');
      }
    });
  }
}
