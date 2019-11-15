import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './containers/products/products.component';
import { ProductComponent } from './containers/product/product.component';

const routes: Routes = [
    {
        path: '',
        component: ProductsComponent
    },
    {
        path: ':categoryId',
        component: ProductsComponent
    },
    {
        path: 'detail/:id',
        component: ProductComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductRoutingModule { }
