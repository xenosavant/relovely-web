import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Product } from '@app/shared/models/product.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { products } from '@app/data/products.data';
import { NavigationService } from '@app/shared/services/navigation.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent implements OnInit {

  product: Product;

  constructor(private route: ActivatedRoute, private navigationService: NavigationService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id: string = params.get('id');
      this.product = products.find(item => {
        return item.id === id;
      });
      this.product.imageUrls = [this.product.asset, this.product.asset, this.product.asset];
    });
  }

  goToProduct(id) {
    this.navigationService.navigate({ path: '/products/detail/' + id });
  }
}
