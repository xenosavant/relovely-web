import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Order } from '@app/shared/models/order.model';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderListComponent implements OnInit {

  @Input() order: Order;
  @Input() seller: boolean = false;
  @Input() detail: boolean = false;

  constructor(private navigationService: NavigationService) { }

  ngOnInit() {
  }

  onImageClick() {
    if (this.detail) {
      this.navigationService.navigate({ path: `/products/detail/${this.order.product.id}` })
    }
  }

}
