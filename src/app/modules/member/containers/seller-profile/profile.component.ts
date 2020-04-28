import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { UserDetail } from '../../../../shared/models/user-detail.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { users } from '@app/data/users.data';
import { products } from '@app/data/products.data';
import { TemplatePortal } from '@angular/cdk/portal';
import { OverlayService } from '@app/shared/services/overlay.service';
import { UserService } from '@app/shared/services/user/user.service';
import { Product } from '@app/shared/models/product.model';

@Component({
  selector: 'app-seller-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SellerProfileComponent implements OnInit {

  @ViewChild('productCreateModal', { static: true }) productCreateModal: TemplatePortal<any>;

  @Input() user: UserDetail;
  @Input() currentUserId: string;
  @Input() owner = false;
  @Output() updateImage: EventEmitter<boolean> = new EventEmitter<boolean>();
  users: UserDetail[];
  showCreate = false;
  editProduct: Product;

  constructor(private route: ActivatedRoute, private overlayService: OverlayService, private userService: UserService) { }

  ngOnInit() {
    // this.user.listings = products.filter(p => {
    //   return p.seller.username === this.user.username;
    // })
    if (this.owner) {
      this.showCreate = true;
    }
  }

  showCreateModal($event: any) {
    this.editProduct = null;
    this.overlayService.open(this.productCreateModal);
  }

  showEditModal(product: any) {
    this.editProduct = product;
    this.overlayService.open(this.productCreateModal);
  }

  close() {
    this.overlayService.close();
  }

  update() {
    this.updateImage.emit(true);
  }
}
