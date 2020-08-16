import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule, MatFormField, MatFormFieldModule, MatSelectModule } from '@angular/material';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '@app/shared';
import { SellerListComponent } from './components/seller-list/seller-list.component';
import { MemberListComponent } from './components/member-list/member-list.component';
import { PromoListComponent } from './components/promo-list/promo-list.component';
import { CreatePromoComponent } from './components/create-promo/create-promo.component';
import { PortalModule } from '@angular/cdk/portal';



@NgModule({
  declarations: [DashboardComponent, SellerListComponent, MemberListComponent, PromoListComponent, CreatePromoComponent],
  imports: [
    AdminRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    SharedModule,
    CommonModule,
    MatSelectModule,
    PortalModule
  ]
})
export class AdminModule { }
