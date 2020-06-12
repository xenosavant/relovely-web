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
      this.code = query['code'];
      if (this.code) {
        // this.authService.linkInstagram(this.code, 'member').subscribe((response) => {
        //   this.router.navigate(['/account/settings']);
        // }, err => {
        //   this.error = err.error.error.message;
        //   this.router.navigate(['/']);
        //   this.navigationService.openAuthWindow({ error: err.error.error.message, page: 'instagram' });
        // });
        console.log(this.code);
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
