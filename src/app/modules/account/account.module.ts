import { NgModule } from '@angular/core';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './containers/signin/signin.component';
import { ResetPasswordComponent } from './containers/reset-password/reset-password.component';
import { PaymentsComponent } from './containers/payments/payments.component';
import { AddressesComponent } from './containers/addresses/addresses.component';
import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '@app/shared';
import { AddAddressComponent } from './components/add-address/add-address.component';
import { InstagramAuthComponent } from './containers/instagram-auth/instagram-auth.component';
@NgModule({
  declarations: [SigninComponent, ResetPasswordComponent, PaymentsComponent,
    AddressesComponent, InstagramAuthComponent,
    AddAddressComponent],
  imports: [
    CommonModule,
    PortalModule,
    SharedModule,
    AccountRoutingModule
  ]
})
export class AccountModule { }
