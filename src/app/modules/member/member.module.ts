import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesComponent } from './containers/favorites/favorites.component';
import { PurchasesComponent } from './containers/purchases/purchases.component';
import { MemberRoutingModule } from './member-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser'
import { SharedModule } from '@app/shared';
import { MemberProfileComponent } from './containers/member-profile/member-profile.component';
import { SellerProfileComponent } from './containers/seller-profile/profile.component';
import { ProfileComponent } from './containers/profile/profile.component';
import { ProductCreateComponent } from './components/product-create/product-create.component';

@NgModule({
  declarations: [SellerProfileComponent, MemberProfileComponent, FavoritesComponent, PurchasesComponent, MemberProfileComponent, ProfileComponent, ProductCreateComponent],
  imports: [
    CommonModule,
    MemberRoutingModule,
    MatTabsModule,
    SharedModule
  ],
  providers: [{
    provide: HAMMER_GESTURE_CONFIG,
    useClass: HammerGestureConfig
  }]
})
export class MemberModule { }
