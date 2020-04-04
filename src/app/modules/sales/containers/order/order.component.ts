import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '@app/shared/models/order.model';
import { orders } from '../../../../data/orders.data';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderComponent implements OnInit {


  public order: Order;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.order = orders.find(item => item.id === params.id);
      console.log(this.order);
    })
  }

}
