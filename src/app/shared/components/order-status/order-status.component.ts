import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { OrderStatus, Order } from '@app/shared/models/order.model';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderStatusComponent implements OnInit {

  @Input()
  order: Order;

  constructor() { }

  ngOnInit() {
  }

}
