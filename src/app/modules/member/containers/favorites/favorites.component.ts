import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Product } from '@app/shared/models/product.model';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { UserService } from '@app/shared/services/user/user.service';
import { ProductService } from '@app/shared/services/product/product.service';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { UserAuth } from '@app/shared/models/user-auth.model';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoritesComponent implements OnInit {

  constructor(private navigationService: NavigationService,
    private userService: UserService,
    private productService: ProductService,
    private ref: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver) { }

  mobile: boolean;
  public products: Product[];
  public user: UserAuth;
  public loading = true;

  ngOnInit() {
    this.navigationService.showNavBar(true, 'FAVORITES');
    this.user = this.userService.user$.getValue();
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.mobile = result.matches;
    })
    this.productService.getFavorites().subscribe(response => {
      this.products = response.items;
      this.ref.markForCheck();
      this.loading = false;
    })
  }

  onUnFavorite(id: string) {
    this.products.splice(this.products.findIndex(p => p.id === id));
    this.products = [...this.products];
    this.ref.markForCheck();
  }
}
