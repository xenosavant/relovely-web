import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { products } from '@app/data/products.data';
import { Product } from '@app/shared/models/product.model';
import { NavigationService } from '@app/shared/services/navigation.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoritesComponent implements OnInit {

  constructor(private navigationService: NavigationService) { }


  public products: Product[];

  ngOnInit() {
    this.products = products;
    this.navigationService.showNavBar(true, 'YOUR FAVORITES');
  }
}
