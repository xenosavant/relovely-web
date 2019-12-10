import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { Product } from '@app/shared/models/product.model';
import { products } from '@app/data/products.data';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationService } from '@app/shared/services/navigation.service';
import { CategoryService } from '@app/shared/services/category.service';
import { NavigationItem } from '@app/shared/models/navigation-item.model';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {

  public products: Product[];
  public title: string;
  grid: boolean;
  mobile: boolean;
  currentNavItem: NavigationItem;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private navigationService: NavigationService,
    private zone: NgZone,
    private categoryService: CategoryService,
    private breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
    this.products = products;
    this.navigationService.navConfig$.subscribe(state => {
      this.grid = state.showProductGrid;
      this.zone.run(() => {
        this.ref.markForCheck();
      })
    });
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.mobile = result.matches;
    });
    this.navigationService.navConfig$.subscribe(result => {
      this.title = result.pageHeader;
    });
    this.route.params.subscribe(params => {
      if (params['categoryId']) {
        this.currentNavItem = this.categoryService.categoryLookup[params['categoryId']];
      } else {
        const root = this.navigationService.rootNavigationItems;
        this.currentNavItem = new NavigationItem([{ key: 'category', value: '0' }], '/products', 'All Products', -1, root, [], null);
      }
      this.navigationService.navigate(this.currentNavItem);
      console.log(this.currentNavItem);
      this.ref.markForCheck();
    });
  }

  selectProduct(id: string) {
    this.navigationService.hideAll();
    this.router.navigate(['/products/detail/' + id]);
  }

}
