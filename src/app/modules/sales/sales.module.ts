import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './containers/checkout/checkout.component';
import { SalesRoutingModule } from './sales-routing.module';
import { SharedModule } from '@app/shared';
import { OrdersComponent } from './containers/orders/orders.component';
import { MatRadioModule } from '@angular/material/radio';
import { OrderComponent } from './containers/order/order.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { SalesComponent } from './containers/sales/sales.component';
import { ReviewComponent } from './containers/review/review.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [CheckoutComponent, OrdersComponent, OrderComponent, OrderListComponent, SalesComponent, ReviewComponent],
  imports: [
    CommonModule,
    SharedModule,
    SalesRoutingModule,
    MatButtonModule,
    MatRadioModule,
    FormsModule
  ]
})
export class SalesModule { }
