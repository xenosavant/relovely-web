import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '@app/shared/models/order.model';
import { OrderService } from '@app/shared/services/order/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderComponent implements OnInit {

  public order: Order;

  constructor(private activatedRoute: ActivatedRoute, private orderService: OrderService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.orderService.getOrder(params['id']).subscribe(order => {
        this.order = order;
        console.log(order);
      })
    })
  }

}
