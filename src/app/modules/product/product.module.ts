import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './containers/products/products.component';
import { ProductComponent } from './containers/product/product.component';
import { ProductRoutingModule } from './product-routing.module';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedModule } from '@app/shared';

@NgModule({
  declarations: [ProductsComponent, ProductComponent, ProductDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    ProductRoutingModule,
    CarouselModule
  ],
  exports: [ProductsComponent, ProductComponent]
})
export class ProductModule { }
