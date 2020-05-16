import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './containers/orders/orders.component';
import { OrderComponent } from './containers/order/order.component';
import { SalesComponent } from './containers/sales/sales.component';
import { CheckoutComponent } from './containers/checkout/checkout.component';


const routes: Routes = [
    {
        path: 'orders',
        component: OrdersComponent
    },
    {
        path: 'sales',
        component: SalesComponent
    },
    {
        path: 'orders/:id',
        component: OrderComponent
    },
    {
        path: 'checkout/:id',
        component: CheckoutComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalesRoutingModule { }
