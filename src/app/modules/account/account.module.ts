import { NgModule } from '@angular/core';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './containers/signin/signin.component';
import { ResetPasswordComponent } from './containers/reset-password/reset-password.component';
import { PaymentsComponent } from './containers/payments/payments.component';
import { AddressesComponent } from './containers/addresses/addresses.component';
import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '@app/shared';
import { InstagramAuthComponent } from './containers/instagram-auth/instagram-auth.component';
import { SignoutComponent } from './containers/signout/signout.component';
import { FacebookAuthComponent } from './containers/facebook-auth/facebook-auth.component';
import { VerifyComponent } from './containers/verify/verify.component';
import { MatRadioModule } from '@angular/material/radio';
import { SettingsComponent } from './containers/settings/settings.component';
@NgModule({
  declarations: [SigninComponent, ResetPasswordComponent, PaymentsComponent,
    AddressesComponent, InstagramAuthComponent,
    SignoutComponent,
    FacebookAuthComponent,
    VerifyComponent,
    SettingsComponent],
  imports: [
    CommonModule,
    PortalModule,
    SharedModule,
    AccountRoutingModule,
    MatRadioModule,
    PortalModule
  ]
})
export class AccountModule { }
