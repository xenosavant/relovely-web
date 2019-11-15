import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { users } from '@app/data/users.data';
import { Product } from '@app/shared/models/product.model';
import { products } from '@app/data/products.data';

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberProfileComponent implements OnInit {

  @Input()
  user: UserDetail;
  @Input()
  owner = false;

  users: UserDetail[];
  products: Product[];

  constructor() { }

  ngOnInit() {
    this.users = users;
    this.products = products;
  }

}
