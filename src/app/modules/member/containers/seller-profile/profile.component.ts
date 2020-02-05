import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { UserDetail } from '../../../../shared/models/user-detail.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { users } from '@app/data/users.data';
import { products } from '@app/data/products.data';
import { TemplatePortal } from '@angular/cdk/portal';
import { OverlayService } from '@app/shared/services/overlay.service';

@Component({
  selector: 'app-seller-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SellerProfileComponent implements OnInit {

  @ViewChild('productCreateModal', { static: true }) productCreateModal: TemplatePortal<any>;

  @Input()
  user: UserDetail;
  @Input()
  owner = false;
  users: UserDetail[];
  constructor(private route: ActivatedRoute, private overlayService: OverlayService) { }

  ngOnInit() {
    this.user.products = products.filter(p => {
      return p.seller.username === this.user.username;
    })
    this.users = users;
  }

  showCreateModal($event: any) {
    this.overlayService.open(this.productCreateModal);
  }

  close() {
    this.overlayService.close();
  }
}
