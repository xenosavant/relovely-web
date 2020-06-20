import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Order } from '@app/shared/models/order.model';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { Router } from '@angular/router';
import { OrderService } from '@app/shared/services/order/order.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NavigationItem } from '@app/shared/models/navigation-item.model';
import { UserService } from '@app/shared/services/user/user.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent implements OnInit {

  public orders: Order[];
  public hoverIndex: number;
  public mobile: boolean;
  public title = 'Orders';
  public loading = true;
  navigationItems: NavigationItem[] = [{ path: 'sales/orders', name: 'Orders' }];

  constructor(private navigationService: NavigationService,
    private orderServive: OrderService, private ref: ChangeDetectorRef,
    private userService: UserService,
    private breakpointObserver: BreakpointObserver) {
    this.navigationService.showNavBar(true, 'ORDERS');
  }

  ngOnInit() {
    if (!this.userService.user$.value) {
      this.navigationService.navigate({ 'path': '/' })
    }
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.mobile = result.matches;
    })
    this.orderServive.getOrders().subscribe(orders => {
      this.orders = orders.items;
      this.loading = false;
      this.ref.markForCheck();
    });
  }

  onEnter(index) {
    this.hoverIndex = index;
  }

  onLeave() {
    this.hoverIndex = -1;
  }

  goToOrder(id: string) {
    this.navigationService.navigate({ path: `/sales/orders/${id}` });
  }

}
