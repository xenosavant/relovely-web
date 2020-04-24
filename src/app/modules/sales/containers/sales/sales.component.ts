import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Order } from '@app/shared/models/order.model';
import { NavigationService } from '@app/shared/services/navigation.service';
import { OrderService } from '@app/shared/services/order/order.service';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['../orders/orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalesComponent implements OnInit {

  public orders: Order[];
  public hoverIndex: number;
  public mobile: boolean;
  public title = 'Sales';

  constructor(private navigationService: NavigationService,
    private orderServive: OrderService, private ref: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver) {
    this.navigationService.showNavBar(true, 'ORDERS');
  }

  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.mobile = result.matches;
      console.log(this.mobile);
    })
    this.orderServive.getOrders(true).subscribe(orders => {
      this.orders = orders.items;
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
    this.navigationService.navigate({ path: `/sales/orders/${id}?sales=true` });
  }

}