import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '@app/shared/models/order.model';
import { OrderService } from '@app/shared/services/order/order.service';
import { UserService } from '@app/shared/services/user/user.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderComponent implements OnInit {

  public order: Order;
  public loading = true;
  seller: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private userService: UserService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.orderService.getOrder(params['id']).subscribe(order => {
        this.order = order;
        this.seller = this.userService.currentUser.id === this.order.seller.id;
        this.loading = false;
        this.ref.markForCheck();
      })
    })
  }

  onTrack() {
    const newWindow = window.open(this.order.trackingUrl);
    newWindow.focus();
  }

  onPrint() {
    const newWindow = window.open();
    newWindow.document.write(`<html><body><img style="height:600px;" src="${this.order.shippingLabelUrl}"/></body></html>`);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
  }

}
