import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Order } from '@app/shared/models/order.model';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { OrderService } from '@app/shared/services/order/order.service';
import { UserService } from '@app/shared/services/user/user.service';
import { timeout } from 'rxjs/operators';

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
  blockClickEvent = false;
  hideAlert = false;

  @Output() clicked: EventEmitter<string> = new EventEmitter();

  constructor(private navigationService: NavigationService, private orderService: OrderService, private userService: UserService, private ref: ChangeDetectorRef) { }

  ngOnInit() {

  }

  onImageClick() {
    if (this.detail) {
      this.navigationService.navigate({ path: `/products/detail/${this.order.product.id}` })
    }
  }

  onPrint() {
    this.blockClickEvent = true;
    this.hideAlert = true;
    this.ref.markForCheck();
    const newWindow = window.open();
    newWindow.document.write(`<html><body onload="window.print();"><img style="height:600px;" src="${this.order.shippingLabelUrl}"/></body></html>`);
    newWindow.document.close();
    newWindow.focus();
    setTimeout(() => {
      this.orderService.shipOrder(this.order.id).subscribe(() => {
        const user = this.userService.user$.getValue();
        if (user.sales) {
          user.sales.splice(user.sales.findIndex(o => o.id === this.order.id));
          this.userService.setCurrentUser(user);
        }
        this.blockClickEvent = false;
      }, err => {
        this.blockClickEvent = false;
      });
    }, 1000)
  }

  onClick() {
    if (!this.blockClickEvent) {
      this.clicked.emit(this.order.id);
    }
  }

}
