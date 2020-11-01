import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesComponent } from './containers/favorites/favorites.component';
import { PurchasesComponent } from './containers/purchases/purchases.component';
import { MemberRoutingModule } from './member-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser'
import { SharedModule } from '@app/shared';
import { MemberProfileComponent } from './containers/member-profile/member-profile.component';
import { SellerProfileComponent } from './containers/seller-profile/seller-profile.component';
import { ProfileComponent } from './containers/profile/profile.component';
import { PortalModule } from '@angular/cdk/portal';
import { TermsComponent } from './containers/terms/terms.component';
import { PrivacyComponent } from './containers/privacy/privacy.component';
import { ReviewsComponent } from './containers/reviews/reviews.component';
import { ListingsComponent } from './containers/listings/listings.component';
import { SellersComponent } from './containers/sellers/sellers.component';

@NgModule({
  declarations: [SellerProfileComponent,
    SellersComponent,
    MemberProfileComponent,
    FavoritesComponent,
    PurchasesComponent,
    MemberProfileComponent,
    ProfileComponent,
    TermsComponent,
    PrivacyComponent,
    ReviewsComponent,
    ListingsComponent],
  imports: [
    CommonModule,
    MemberRoutingModule,
    MatTabsModule,
    PortalModule,
    SharedModule
  ],
  providers: [{
    provide: HAMMER_GESTURE_CONFIG,
    useClass: HammerGestureConfig
  }]
})
export class MemberModule { }
