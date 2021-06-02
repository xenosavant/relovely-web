import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './containers/products/products.component';
import { ProductComponent } from './containers/product/product.component';
import { ProductRoutingModule } from './product-routing.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedModule } from '@app/shared';
import { DesktopFiltersComponent } from './components/desktop-filters/desktop-filters.component';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  declarations: [ProductsComponent, ProductComponent, DesktopFiltersComponent],
  imports: [
    CommonModule,
    SharedModule,
    ProductRoutingModule,
    CarouselModule,
    PortalModule
  ],
  exports: [ProductsComponent, ProductComponent]
})
export class ProductModule { }
