import { Component, OnInit, ChangeDetectionStrategy, Input, NgZone, ChangeDetectorRef } from '@angular/core';
import { UserDetail } from '../../../../shared/models/user-detail.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { users } from '@app/data/users.data';
import { products } from '@app/data/products.data';
import { UserService } from '@app/shared/services/user/user.service';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {

  user: UserDetail;
  users: UserDetail[];
  mobile: boolean;
  owner = false;
  loading = true;
  constructor(private breakpointObserver: BreakpointObserver, private route: ActivatedRoute,
    private userService: UserService, private zone: NgZone, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      const id = param.get('id');
      if (!this.user || (this.user && id !== this.user.id)) {
        if (id !== 'profile') {
          this.user = users.find(u => u.id === id);
          this.zone.run(() => {
            this.ref.markForCheck();
            this.loading = false;
          });
        } else {
          this.userService.getUser(this.userService.currentUser.id).subscribe(user => {
            console.log(user);
            this.owner = true;
            this.user = user;
            this.loading = false;
            this.ref.markForCheck();
          });
          this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
            this.mobile = result.matches;
          });
        }
      }
    });
  }
}
