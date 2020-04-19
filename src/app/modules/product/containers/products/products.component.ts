import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { Product } from '@app/shared/models/product.model';
import { products } from '@app/data/products.data';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationService } from '@app/shared/services/navigation.service';
import { LookupService } from '@app/shared/services/lookup/lookup.service';
import { NavigationItem } from '@app/shared/models/navigation-item.model';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Category } from '@app/shared/models/category.model';
import { ProductService } from '@app/shared/services/product/product.service';
import { FilterService } from '@app/shared/services/filter/filter.service';
import { IUserPreferences } from '@app/shared/services/filter/filter-state';

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
  categoryId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private navigationService: NavigationService,
    private zone: NgZone,
    private lookupService: LookupService,
    private breakpointObserver: BreakpointObserver,
    private productService: ProductService,
    private filterService: FilterService) { }

  ngOnInit() {
    this.products = [];
    this.navigationService.navConfig$.subscribe(state => {
      this.grid = state.showProductGrid;
      this.title = state.pageHeader;
      this.zone.run(() => {
        this.ref.markForCheck();
      })
    });
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.mobile = result.matches;
    });
    this.route.params.subscribe(params => {
      if (params['categoryId']) {
        this.categoryId = params['categoryId'];
        this.currentNavItem = this.lookupService.navLookup[params['categoryId']];
        this.filterService.getState().then(state => {
          this.getProducts(state);
        });
      } else {
        const root = this.navigationService.rootNavigationItems;
        this.currentNavItem = new NavigationItem([{ key: 'category', value: '0' }], '/products', 'All Products', "-1", root, [], null);
      }
      this.navigationService.navigate(this.currentNavItem);
      this.ref.markForCheck();
    })

    this.filterService.filterState$.subscribe(state => {
      this.getProducts(state);
    });
  }

  selectProduct(id: string) {
    this.navigationService.hideAll();
    this.router.navigate(['/products/detail/' + id]);
  }

  getProducts(state: IUserPreferences) {
    const filteredSizes = [];
    this.lookupService.getState().then(lookupValues => {
      state.sizes.forEach(id => {
        console.log(state);
        const size = lookupValues.sizes.find(size => size.id === id);
        if (size.categoryIds.includes(this.categoryId)) {
          filteredSizes.push(id);
        }
      });
      this.productService.getProducts(this.categoryId, filteredSizes.length ? state.sizes : null,
        state.colors.length ? state.colors : null, state.prices.length ? state.prices : null).subscribe(result => {
          this.products = result.items;
          this.ref.markForCheck();
        })
    })
  }

}
