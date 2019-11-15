import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { UserDetail } from '../../../../shared/models/user-detail.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { users } from '@app/data/users.data';
import { products } from '@app/data/products.data';

@Component({
  selector: 'app-seller-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SellerProfileComponent implements OnInit {

  @Input()
  user: UserDetail;
  @Input()
  owner = false;
  users: UserDetail[];
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.user.products = products.filter(p => {
      return p.sellerUsername === this.user.username;
    })
    this.users = users;
  }
}
