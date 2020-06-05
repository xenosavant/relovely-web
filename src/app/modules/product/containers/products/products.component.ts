import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone, ViewChild } from '@angular/core';
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
import { UserService } from '@app/shared/services/user/user.service';
import { TemplatePortal } from '@angular/cdk/portal';
import { OverlayService } from '@app/shared/services/overlay.service';
import { CATEGORY_MAP } from '@app/shared/services/lookup/category-image-map';
import { Subscription } from 'rxjs';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { UserAuth } from '@app/shared/models/user-auth.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {

  public products: Product[];
  public product: Product;
  public title: string;
  grid: boolean;
  mobile: boolean;
  currentNavItem: NavigationItem;
  categoryId: string;
  currentUser: UserAuth;
  empty = false;
  emptyImage: string = null;
  filterSub: Subscription = null;
  parentCategory: string = null;
  checkBack: boolean;
  loading = true;

  @ViewChild('productCreateModal', { static: true }) productCreateModal: TemplatePortal<any>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private navigationService: NavigationService,
    private zone: NgZone,
    private lookupService: LookupService,
    private breakpointObserver: BreakpointObserver,
    private productService: ProductService,
    private filterService: FilterService,
    private userService: UserService,
    private overlayService: OverlayService) { }

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
        if (this.filterSub) {
          this.filterSub.unsubscribe();
        }
        this.filterSub = this.filterService.filterStateSubject$.subscribe(state => {
          this.loading = true;
          this.getProducts(state);
        });
      } else {
        const root = this.navigationService.rootNavigationItems;
        this.currentNavItem = new NavigationItem([{ key: 'category', value: '0' }], '/products', 'All Products', "-1", root, [], null);
      }
      this.navigationService.navigate(this.currentNavItem);
      this.ref.markForCheck();
    })

    this.userService.getCurrentUser().then(u => {
      this.currentUser = u ? u : null;
    });

  }

  selectProduct(id: string) {
    this.navigationService.hideAll();
    this.router.navigate(['/products/detail/' + id]);
  }

  editProduct(product: Product) {
    this.product = product;
    this.overlayService.open(this.productCreateModal);
  }

  getProducts(state: IUserPreferences) {
    const filteredSizes = [];
    this.lookupService.getState().then(lookupValues => {
      state.sizes.forEach(id => {
        const size = lookupValues.sizes.find(size => size.id === id);
        if (size.categoryIds.includes(this.categoryId)) {
          filteredSizes.push(id);
        }
      });
      this.productService.getProducts(this.categoryId, filteredSizes.length ? state.sizes : null,
        state.colors.length ? state.colors : null, state.prices.length ? state.prices : null).subscribe(result => {
          this.products = result.items;
          const cat: Category = this.lookupService.getCategory(this.categoryId);
          if (!this.products.length) {
            if (cat.parent && cat.parent.parent) {
              this.checkBack = false;
              this.parentCategory = cat.parent.parent.plural + ' ' + cat.parent.name;
              this.emptyImage = '../../../../../assets/images/' + CATEGORY_MAP[cat.parent.id];
            } else if (cat.parent) {
              this.emptyImage = '../../../../../assets/images/' + CATEGORY_MAP[cat.id];
              this.checkBack = true;
            }
            this.empty = true;
          } else {
            this.empty = false;
          }
          this.loading = false;
          this.ref.markForCheck();
        })
    })
  }

  goToParent() {
    const cat: Category = this.lookupService.getCategory(this.categoryId);
    this.router.navigate(['/products/' + cat.parent.id]);
  }

  onClose() {
    this.overlayService.close();
  }

}
