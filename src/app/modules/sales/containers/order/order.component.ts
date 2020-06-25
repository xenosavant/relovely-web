import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '@app/shared/models/order.model';
import { OrderService } from '@app/shared/services/order/order.service';
import { UserService } from '@app/shared/services/user/user.service';
import { CARD_TYPE_MAP } from '@app/shared/services/lookup/payment-card-map';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { NavigationItem } from '@app/shared/models/navigation-item.model';
import { BreakpointObserver } from '@angular/cdk/layout';

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
  typeMap = CARD_TYPE_MAP;
  navigationItems: NavigationItem[];
  public mobile: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private userService: UserService,
    private ref: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    private navigationService: NavigationService) { }

  ngOnInit() {
    if (!this.userService.user$.getValue()) {
      this.navigationService.navigate({ 'path': '/' })
    }
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.mobile = result.matches;
    })
    this.activatedRoute.params.subscribe(params => {
      this.orderService.getOrder(params['id']).subscribe(order => {
        this.order = order;
        if (this.seller) {
          this.navigationItems = [{ path: '/sales/sales', name: 'Sales' }, { path: `/sales/orders/${this.order.id}`, name: this.order.orderNumber }];
        } else {
          this.navigationItems = [{ path: '/sales/orders', name: 'Orders' }, { path: `/sales/orders/${this.order.id}`, name: this.order.orderNumber }];
        }

        this.seller = this.userService.user$.getValue().id === this.order.seller.id;
        this.loading = false;
        this.ref.markForCheck();
      })
    })
  }

  onTrack() {
    const newWindow = window.open(this.order.trackingUrl);
    newWindow.focus();
  }

  onReview() {
    this.navigationService.navigate({ path: `/sales/review/${this.order.id}` });
  }

  onPrint() {
    const newWindow = window.open();
    newWindow.document.write(`<html><body onload="window.print();"><img style="height:600px;" src="${this.order.shippingLabelUrl}"/></body></html>`);
    newWindow.document.close();
    newWindow.focus();
    this.orderService.shipOrder(this.order.id).subscribe(() => {
      const user = this.userService.user$.getValue();
      user.sales.splice(user.sales.findIndex(o => o.id === this.order.id));
      this.userService.setCurrentUser(user);
    });
  }

}
