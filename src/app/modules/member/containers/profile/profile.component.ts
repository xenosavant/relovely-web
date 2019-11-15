import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { UserDetail } from '../../../../shared/models/user-detail.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { users } from '@app/data/users.data';
import { products } from '@app/data/products.data';
import { UserService } from '@app/shared/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {

  user: UserDetail;
  users: UserDetail[];
  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.user = this.userService.currentUser;
  }
}
