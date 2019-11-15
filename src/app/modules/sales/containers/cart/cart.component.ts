import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Product } from '@app/shared/models/product.model';
import { products } from '@app/data/products.data';
import { NavigationService } from '@app/shared/services/navigation.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent implements OnInit {

  cartProducts: Product[];

  constructor(private navigationService: NavigationService) { }

  ngOnInit() {
    this.cartProducts = products.slice(0, 5);
    this.navigationService.showNavBar(true, 'YOUR SHOPPING BAG');
  }
}
