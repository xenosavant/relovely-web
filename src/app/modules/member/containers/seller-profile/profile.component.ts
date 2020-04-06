import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { UserDetail } from '../../../../shared/models/user-detail.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { users } from '@app/data/users.data';
import { products } from '@app/data/products.data';
import { TemplatePortal } from '@angular/cdk/portal';
import { OverlayService } from '@app/shared/services/overlay.service';
import { UserService } from '@app/shared/services/user/user.service';

@Component({
  selector: 'app-seller-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SellerProfileComponent implements OnInit {

  @ViewChild('productCreateModal', { static: true }) productCreateModal: TemplatePortal<any>;

  @Input() user: UserDetail;
  @Input() owner = true;
  @Output() updateImage: EventEmitter<boolean> = new EventEmitter<boolean>();
  users: UserDetail[];
  showCreate = false;

  constructor(private route: ActivatedRoute, private overlayService: OverlayService, private userService: UserService) { }

  ngOnInit() {
    // this.user.listings = products.filter(p => {
    //   return p.seller.username === this.user.username;
    // })
    if (this.owner) {
      this.showCreate = true;
    }
    this.users = users;
  }

  showCreateModal($event: any) {
    this.overlayService.open(this.productCreateModal);
  }

  close() {
    this.overlayService.close();
  }

  update() {
    this.updateImage.emit(true);
  }
}
