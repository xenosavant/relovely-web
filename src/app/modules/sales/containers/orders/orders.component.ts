import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Order } from '@app/shared/models/order.model';
import { orders } from '@app/data/orders.data';
import { NavigationService } from '@app/shared/services/navigation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent implements OnInit {

  public orders: Order[];
  public hoverIndex: number;

  constructor(private navigationService: NavigationService) {
    this.orders = orders;
    this.orders = orders.concat(orders);
    this.orders = this.orders.concat(orders);
    this.orders = this.orders.concat(orders);
    this.navigationService.showNavBar(true, 'ORDERS');
  }

  ngOnInit() {
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
