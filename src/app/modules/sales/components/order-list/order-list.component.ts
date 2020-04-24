import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Order } from '@app/shared/models/order.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderListComponent implements OnInit {

  @Input() order: Order;
  @Input() seller: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
