import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './containers/orders/orders.component';
import { OrderComponent } from './containers/order/order.component';
import { SalesComponent } from './containers/sales/sales.component';


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
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalesRoutingModule { }
