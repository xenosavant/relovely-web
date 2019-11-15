import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartComponent } from './containers/cart/cart.component';
import { OrdersComponent } from './containers/orders/orders.component';
import { AddressesComponent } from './containers/addresses/addresses.component';


const routes: Routes = [
    {
        path: 'addresses',
        component: AddressesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }
