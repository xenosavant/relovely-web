import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Product } from '@app/shared/models/product.model';
import { products } from '@app/data/products.data';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationService } from '@app/shared/services/navigation.service';
import { CategoryService } from '@app/shared/services/category.service';
import { NavigationItem } from '@app/shared/models/navigation-item.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {

  public products: Product[];
  grid: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private navigationService: NavigationService,
    private categoryService: CategoryService) { }

  ngOnInit() {
    this.products = products;
    this.navigationService.navConfig$.subscribe(state => {
      this.grid = state.showProductGrid;
      this.ref.markForCheck();
    });
    this.route.params.subscribe(params => {
      if (params['categoryId']) {
        this.navigationService.navigate(this.categoryService.categoryLookup[params['categoryId']], true);
      } else {
        const root = this.navigationService.rootNavigationItems;
        this.navigationService.navigate(new NavigationItem([{ key: 'category', value: '0' }], '/products', 'All Products', -1, root, [], null));
      }
    });
  }

  selectProduct(id: string) {
    this.navigationService.hideAll();
    this.router.navigate(['/products/detail/' + id]);
  }

}
