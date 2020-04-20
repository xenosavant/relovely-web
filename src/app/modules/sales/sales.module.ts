import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './containers/checkout/checkout.component';
import { SalesRoutingModule } from './sales-routing.module';
import { SharedModule } from '@app/shared';
import { MatButtonModule } from '@angular/material';
import { OrdersComponent } from './containers/orders/orders.component';
import { OrderComponent } from './containers/order/order.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { SalesComponent } from './containers/sales/sales.component';

@NgModule({
  declarations: [CheckoutComponent, OrdersComponent, OrderComponent, OrderListComponent, SalesComponent],
  imports: [
    CommonModule,
    SharedModule,
    SalesRoutingModule,
    MatButtonModule
  ]
})
export class SalesModule { }
