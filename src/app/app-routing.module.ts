import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsContainerComponent } from './settings';
import { HomeComponent } from '../app/core/components/home/home.component'
import { NotFoundComponent } from '../app/core/components/not-found/not-found.component'
import { ProductsComponent } from './modules/product/containers/products/products.component';
import { AboutComponent } from './core/components/about/about.component';
import { AdminGuard } from './shared/guards/admin.guard';
import { ProfileComponent } from './modules/member/containers/profile/profile.component';
import { HelpComponent } from './core/components/help/help.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'about',
    component: AboutComponent,
    pathMatch: 'full'
  },
  {
    path: 'help',
    component: HelpComponent,
    pathMatch: 'full'
  },
  {
    path: 'products',
    loadChildren: '../app/modules/product/product.module#ProductModule'
  },
  {
    path: 'member',
    loadChildren: '../app/modules/member/member.module#MemberModule'
  },
  {
    path: 'sales',
    loadChildren: '../app/modules/sales/sales.module#SalesModule'
  },
  {
    path: 'account',
    loadChildren: '../app/modules/account/account.module#AccountModule'
  },
  {
    path: 'admin',
    loadChildren: '../app/modules/admin/admin.module#AdminModule',
  },
  {
    path: ':id',
    redirectTo: `/member/:id`
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
