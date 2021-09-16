import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { UserService } from '@app/shared/services/user/user.service';
import { ProductService } from '@app/shared/services/product/product.service';
import { Product } from '@app/shared/models/product.model';
import { UserAuth } from '@app/shared/models/user-auth.model';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayService } from '@app/shared/services/overlay.service';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListingsComponent implements OnInit {

  constructor(private navigationService: NavigationService,
    private userService: UserService,
    private productService: ProductService,
    private ref: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    private overlayService: OverlayService) { }

  mobile: boolean;
  public products: Product[];
  public user: UserAuth;
  productModalSubscription: Subscription;


  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.mobile = result.matches;
    })
    this.navigationService.showNavBar(true, 'LISTINGS');
    this.user = this.userService.user$.getValue();
    this.getListings();
    if (!this.productModalSubscription) {
      this.productModalSubscription = this.productService.productModalClosed$.subscribe(success => {
        if (success) {
          this.overlayService.close();
          this.getListings();
        } else {
          this.overlayService.close();
        }
      })
    }
  }

  ngOnDestroy() {
    this.productModalSubscription.unsubscribe();
  }

  getListings() {
    this.productService.getListings().subscribe(response => {
      this.products = response.items;
      this.ref.markForCheck();
    })
  }

  onDelete(id: string) {
    this.productService.deleteProduct(id).subscribe(() => {
      this.products.splice(this.products.findIndex(p => p.id === id), 1);
      Object.assign(this.products, { ...this.products });
    })
  }

  onEdit(product: Product) {
    this.productService.showProductCreate(product, this.user.id, product.type);
  }

  goToProduct(id: string) {
    this.navigationService.navigate({ path: '/products/detail/' + id })
  }
}
