import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule, MatFormField, MatFormFieldModule } from '@angular/material';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '@app/shared';



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    AdminRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    SharedModule,
    CommonModule
  ]
})
export class AdminModule { }
