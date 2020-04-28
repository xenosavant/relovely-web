import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Product } from '@app/shared/models/product.model';
import { NavigationService } from '@app/shared/services/navigation.service';
import { UserService } from '@app/shared/services/user/user.service';
import { ProductService } from '@app/shared/services/product/product.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoritesComponent implements OnInit {

  constructor(private navigationService: NavigationService,
    private userService: UserService,
    private productService: ProductService) { }


  public products: Product[];
  public userId: string;

  ngOnInit() {
    this.navigationService.showNavBar(true, 'YOUR FAVORITES');
    this.userService.getCurrentUser().then(user => {
      this.userId = user.id;
    });
    this.productService.getFavorites().subscribe(response => {
      this.products = response.items;
    })
  }
}
