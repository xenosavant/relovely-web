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

  constructor(private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private navigationService: NavigationService,
    private router: Router,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    combineLatest([this.activatedRoute.queryParams, this.activatedRoute.params]).subscribe(([query, route]) => {
      this.type = route['type'];
      this.code = query['code'];
      if (this.type) {
        if (this.code) {
          console.log(this.code);
          // if (this.type === 'member') {
          //   this.authService.getInstagramToken(this.code).subscribe((response) => {
          //     this.router.navigate(['/']);
          //     this.navigationService.openAuthWindow({ username: response.username, token: response.token, page: 'instagram' });
          //   }, err => {
          //     this.error = err.error.error.message;
          //     this.router.navigate(['/']);
          //     this.navigationService.openAuthWindow({ error: err.error.error.message, page: 'instagram' });
          //   });
          // }
          // else if (this.type === 'seller') {
          //   this.authService.getInstagramToken(this.code).subscribe((response) => {
          //     this.router.navigate(['/']);
          //     this.navigationService.openAuthWindow({ username: response.username, token: response.token, page: 'sell' });
          //   }, err => {
          //     this.error = err.error.error.message;
          //     this.router.navigate(['/']);
          //     this.navigationService.openAuthWindow({ error: err.error.error.message, page: 'sell' });
          //   });
          // }
        } else {
          this.success = true;
        }
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
