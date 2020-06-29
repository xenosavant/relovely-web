import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone, ViewChild } from '@angular/core';
import { Product } from '@app/shared/models/product.model';
import { products } from '@app/data/products.data';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
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
import { Subscription, fromEvent } from 'rxjs';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { UserAuth } from '@app/shared/models/user-auth.model';
import { withLatestFrom, map, startWith, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { ViewportScroller } from '@angular/common';
import { ListResponse } from '@app/shared/services/list-response';

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
  searchTerm: string;
  total: number;
  currentPage: number = 0;
  productModalSubscription: Subscription;
  scrollTo: number;
  cache: any;


  @ViewChild('productCreateModal', { static: true }) productCreateModal: TemplatePortal<any>;

  constructor(
    private viewportScroller: ViewportScroller,
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
    this.route.params.pipe(withLatestFrom(this.route.queryParams)).subscribe(params => {
      const routeParams = params[0];
      const queryParams = params[1];
      this.searchTerm = queryParams['search'];
      this.currentPage = queryParams['page'] ? +queryParams['page'] - 1 : 0;
      if (routeParams['categoryId']) {
        this.categoryId = routeParams['categoryId'];
        this.currentNavItem = this.lookupService.navLookup[routeParams['categoryId']];
        if (this.filterSub) {
          this.filterSub.unsubscribe();
        }
      } else {
        const root = this.navigationService.rootNavigationItems;
        this.currentNavItem = new NavigationItem([{ key: 'page', value: (this.currentPage + 1).toString() }], '/products', 'All Products', "-1", root, [], null);
        this.categoryId = '0';
      }
      if (this.navigationService.back) {
        this.navigationService.back = false;
        this.scrollTo = this.navigationService.getNavigationItem().scrollPosition;
        this.cache = this.navigationService.getNavigationItem().data;
        this.navigationService.navigate(this.currentNavItem, false, true);
      } else {
        this.navigationService.navigate(this.currentNavItem, false, true);
      }
      this.filterSub = this.filterService.filterStateSubject$.subscribe(state => {
        this.loading = true;
        this.getProducts(state);
      });
      this.ref.markForCheck();
    })

    this.route.queryParams.subscribe(params => {
      const newTerm = params['search'];
      if (this.searchTerm !== newTerm) {
        this.searchTerm = params['search'];
        this.getProducts(this.filterService.filterStateSubject$.getValue());
      }
    })

    if (!this.productModalSubscription) {
      this.productModalSubscription = this.productService.productModalClosed$.subscribe(success => {
        if (success) {
          this.overlayService.close();
          this.getProducts(this.filterService.filterStateSubject$.getValue());
        } else {
          this.overlayService.close();
        }
      })
    }

    this.currentUser = this.userService.user$.getValue();
  }

  ngOnDestroy() {
    this.productModalSubscription.unsubscribe();
  }

  selectProduct(id: string) {
    this.navigationService.hideAll();
    this.navigationService.navigate({ path: '/products/detail/' + id });
  }

  editProduct(product: Product) {
    this.productService.showProductCreate(product, this.currentUser.id)
  }

  getProducts(state: IUserPreferences) {
    if (this.cache) {
      this.loadData({ items: this.cache.products, count: this.cache.total });
      const navService = this.navigationService;
      const scrollTo = this.scrollTo;
      setTimeout(function () {
        navService.scrollToPosition(scrollTo);
      });
      this.scrollTo = null;
      this.cache = null;
    } else {
      const filteredSizes = [];
      this.loading = true;
      this.lookupService.getLookupData().subscribe(lookup => {
        const a = lookup.sizes;
        const validGroups = lookup.sizes.filter(group => this.categoryId === '0' || group.categoryIds.includes(this.categoryId));
        state.sizes.forEach(id => {
          if (validGroups.some(g => g.filters.some(f => f.key === id))) {
            filteredSizes.push(id);
          }
        });
        this.productService.getProducts(this.currentPage, this.categoryId || '-1', this.searchTerm, filteredSizes.length ? state.sizes : null,
          state.colors.length ? state.colors : null, state.prices.length ? state.prices : null).subscribe(result => {
            this.loadData(result);
            const navService = this.navigationService;
            setTimeout(function () {
              navService.scrollToPosition(0);
            });
          })
      })
    }
  }

  loadData(data: ListResponse<Product>) {
    this.products = data.items;
    this.total = data.count;
    this.navigationService.setData({ products: data.items, total: data.count })
    const cat: Category = this.lookupService.getCategory(this.categoryId);
    if (!this.products.length) {
      if (!cat || this.categoryId === '-1') {
        this.emptyImage = '../../../../../assets/images/women-clothing.svg';
      } else {
        if (cat.parent && cat.parent.parent) {
          this.checkBack = false;
          this.parentCategory = cat.parent.parent.plural + ' ' + cat.parent.name;
          this.emptyImage = '../../../../../assets/images/' + CATEGORY_MAP[cat.parent.id];
        } else if (cat.parent) {
          this.emptyImage = '../../../../../assets/images/' + CATEGORY_MAP[cat.id];
          this.checkBack = true;
        } else {
          if (cat.id === '1') {
            this.emptyImage = '../../../../../assets/images/women-clothing.svg';
          }
          if (cat.id === '2') {
            this.emptyImage = '../../../../../assets/images/men-clothing.svg';
          }
          this.checkBack = true;
        }
      }
      this.empty = true;
    } else {
      this.empty = false;
    }
    this.loading = false;
    this.ref.markForCheck();

  }

  paginate(event: any) {
    this.currentPage = event.pageIndex;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { page: event.pageIndex + 1 },
        queryParamsHandling: 'merge'
      });
    this.getProducts(this.filterService.filterStateSubject$.getValue());
  }

  goToParent() {
    const cat: Category = this.lookupService.getCategory(this.categoryId);
    this.router.navigate(['/products/' + cat.parent.id]);
  }

  onClose() {
    this.overlayService.close();
  }

  onDelete(id: string) {
    this.getProducts(this.filterService.filterStateSubject$.getValue());
  }

}
