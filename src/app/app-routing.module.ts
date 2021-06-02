import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '../app/core/components/home/home.component'
import { NotFoundComponent } from '../app/core/components/not-found/not-found.component'
import { AboutComponent } from './core/components/about/about.component';
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
    loadChildren: () => import('../app/modules/product/product.module').then(m => m.ProductModule)
  },
  {
    path: 'member',
    loadChildren: () => import('../app/modules/member/member.module').then(m => m.MemberModule)
  },
  {
    path: 'sales',
    loadChildren: () => import('../app/modules/sales/sales.module').then(m => m.SalesModule)
  },
  {
    path: 'account',
    loadChildren: () => import('../app/modules/account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('../app/modules/admin/admin.module').then(m => m.AdminModule),
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
