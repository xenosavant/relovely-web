import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartComponent } from './containers/cart/cart.component';
import { OrdersComponent } from './containers/orders/orders.component';
import { AddressesComponent } from './containers/addresses/addresses.component';
import { InstagramAuthComponent } from './containers/instagram-auth/instagram-auth.component';
import { SignoutComponent } from './containers/signout/signout.component';
import { FacebookAuthComponent } from './containers/facebook-auth/facebook-auth.component';
import { VerifyComponent } from './containers/verify/verify.component';


const routes: Routes = [
    {
        path: 'addresses',
        component: AddressesComponent
    },
    {
        path: 'instagram',
        component: InstagramAuthComponent
    },
    {
        path: 'facebook',
        component: FacebookAuthComponent
    },
    {
        path: 'verify',
        component: VerifyComponent
    },
    {
        path: 'signout',
        component: SignoutComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }
