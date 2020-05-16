import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Product } from '@app/shared/models/product.model';
import { NavigationService } from '@app/shared/services/navigation.service';
import { UserService } from '@app/shared/services/user/user.service';
import { ProductService } from '@app/shared/services/product/product.service';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { UserAuth } from '@app/shared/models/user-auth.model';

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
    private ref: ChangeDetectorRef) { }


  public products: Product[];
  public user: UserAuth;

  ngOnInit() {
    this.navigationService.showNavBar(true, 'YOUR FAVORITES');
    this.userService.getCurrentUser().then(user => {
      console.log(this.user);
      this.user = user;
    });
    this.productService.getFavorites().subscribe(response => {
      this.products = response.items;
      this.ref.markForCheck();
    })
  }
}
