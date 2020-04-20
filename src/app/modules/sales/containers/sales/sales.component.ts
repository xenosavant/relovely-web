import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Order } from '@app/shared/models/order.model';
import { NavigationService } from '@app/shared/services/navigation.service';
import { OrderService } from '@app/shared/services/order/order.service';

@Component({
  selector: 'app-sales',
  templateUrl: '../orders/orders.component.html',
  styleUrls: ['../orders/orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalesComponent implements OnInit {

  public orders: Order[];
  public hoverIndex: number;

  constructor(private navigationService: NavigationService,
    private orderServive: OrderService, private ref: ChangeDetectorRef) {
    this.navigationService.showNavBar(true, 'ORDERS');
  }

  ngOnInit() {
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
