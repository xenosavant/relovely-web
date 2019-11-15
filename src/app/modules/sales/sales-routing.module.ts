import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartComponent } from './containers/cart/cart.component';
import { OrdersComponent } from './containers/orders/orders.component';


const routes: Routes = [
    {
        path: 'cart',
        component: CartComponent
    },
    {
        path: 'orders',
        component: OrdersComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalesRoutingModule { }
