import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './containers/orders/orders.component';
import { OrderComponent } from './containers/order/order.component';
import { SalesComponent } from './containers/sales/sales.component';
import { CheckoutComponent } from './containers/checkout/checkout.component';
import { ReviewComponent } from './containers/review/review.component';
import { DashboardComponent } from './containers/dashboard/dashboard.component';


const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
