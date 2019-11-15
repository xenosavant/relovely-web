import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './containers/checkout/checkout.component';
import { CartComponent } from './containers/cart/cart.component';
import { SalesRoutingModule } from './sales-routing.module';
import { SharedModule } from '@app/shared';
import { MatButtonModule } from '@angular/material';
import { OrdersComponent } from './containers/orders/orders.component';

@NgModule({
  declarations: [CheckoutComponent, CartComponent, OrdersComponent],
  imports: [
    CommonModule,
    SharedModule,
    SalesRoutingModule,
    MatButtonModule
  ]
})
export class SalesModule { }
