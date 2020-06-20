import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './containers/orders/orders.component';
import { OrderComponent } from './containers/order/order.component';
import { SalesComponent } from './containers/sales/sales.component';
import { CheckoutComponent } from './containers/checkout/checkout.component';
import { ReviewComponent } from './containers/review/review.component';
import { AuthenticationGuard } from '@app/shared/guards/auth.guard';
import { SellerGuard } from '@app/shared/guards/seller.guard';


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
    },
    {
        path: 'review/:id',
        component: ReviewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalesRoutingModule { }
