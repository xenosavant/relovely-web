import browser from 'browser-detect';
import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild, ElementRef, Inject } from '@angular/core';
import { Observable, BehaviorSubject, fromEvent } from 'rxjs';

import {
  LocalStorageService
} from '@app/core';
import { environment as env } from '@env/environment';

import {
  ActionSettingsChangeLanguage,
  ActionSettingsChangeAnimationsPageDisabled,
  selectSettingsLanguage,
  selectSettingsStickyHeader
} from './settings';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NavigationItem } from './shared/models/navigation-item.model';
import { CategoryService } from './shared/services/category.service';
import { KeyValue, DOCUMENT } from '@angular/common';
import { Router, Navigation } from '@angular/router';
import { NavigationService } from './shared/services/navigation.service';
import { UserService } from './shared/services/user.service';
import { Category } from './shared/models/category.model';
import { products } from './data/products.data';
import { timeInterval, timeout, throttleTime, map, pairwise, tap } from 'rxjs/operators';
import { Direction } from '@angular/cdk/bidi/typings/directionality';
import { MatSidenavContainer, MatMenuTrigger } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  isProd = env.production;
  envName = env.envName;
  version = env.versions.app;
  year = new Date().getFullYear();


  showSearch: boolean = false;
  public mobile: boolean = true;
  public sidenavOpen: boolean = false;
  public header: string;
  public navHeader: string;
  public categoryFilters: Category[];
  public chipItems: NavigationItem[];
  public currentNavigationItems: NavigationItem[];
  public desktopNavigationItems: NavigationItem[] = [];
  public desktopLinkItems: NavigationItem[] = [];
  public selectedDesktopNavSubItems: NavigationItem[];
  public accountNav: NavigationItem;


  public showFilterBar: boolean;
  public showNavBar: boolean;
  public showTopLevel: boolean;
  public showProductGrid: boolean;
  public scrolledToTop = true;
  public scroll0 = true;
  public showOverlay = false;
  public showProfile = false;
  public showHeader = false;
  public showMegaMenu = false;
  public showExtendedHeader = false;

  get top(): number {
    return ((this.showFilterBar ? 70 : 0) + (this.showNavBar ? 44 : 0));
  }

  @ViewChild('offsetContent', { static: false }) content: ElementRef;
  @ViewChild(MatSidenavContainer, { static: true }) container: MatSidenavContainer;
  @ViewChild('menuTrigger', { read: MatMenuTrigger, static: false }) trigger: MatMenuTrigger;

  constructor(
    private storageService: LocalStorageService,
    private categoryService: CategoryService,
    private breakpointObserver: BreakpointObserver,
    private navigationService: NavigationService,
    private ref: ChangeDetectorRef,
    private zone: NgZone,
    private userService: UserService,
    @Inject(DOCUMENT) private document: any
  ) {
    this.showFilterBar = false;
    this.showNavBar = false;
    this.showTopLevel = true;
    this.navigationService.navConfig$.subscribe(val => {
      this.categoryFilters = val.categoryItems;
      this.navHeader = val.navigationHeader;
      this.header = val.pageHeader;
      this.showNavBar = val.showNavBar;
      this.showFilterBar = val.showFilterBar;
      this.showProductGrid = val.showProductGrid;
      this.showTopLevel = val.showTopLeveNavigation;
      this.chipItems = val.chipItems;
      this.currentNavigationItems = val.currentNavigationItems;
      this.ref.detectChanges();
    });
  }

  ngOnInit(): void {
    products.forEach(p => {
      let indexArray = products.map((p, index) => index);
      for (let i = 1; i < 6; i++) {
        const index = indexArray.splice(Math.ceil(Math.random() * indexArray.length) - 1, 1)[0];
        p.similarItems.push(products[index]);
      }
      for (let i = 1; i < 6; i++) {
        const index = indexArray.splice(Math.ceil(Math.random() * indexArray.length) - 1, 1)[0];
        p.moreItems.push(products[index]);
      }
    });
    this.breakpointObserver.observe(['(max-width: 799px)']).subscribe(result => {
      this.mobile = result.matches;
    })
    this.categoryService.getCatgories().subscribe(cats => {
      const navigationItems = cats.map(cat => {
        return new NavigationItem([], null, cat.name, cat.id,
          cat.children.map(c1 => {
            return new NavigationItem(
              [{ key: 'category', value: c1.id.toString() }],
              '/products/' + c1.id.toString(),
              c1.name,
              c1.id,
              c1.children.map(c2 => {
                return new NavigationItem(
                  [{ key: 'category', value: c2.id.toString() }],
                  '/products/' + c2.id.toString(),
                  c2.name,
                  c2.id,
                  [],
                  [],
                  null)
              }),
              c1.children,
              null
            )
          }),
          [],
          null)
      });
      navigationItems.forEach(item => {
        this.setParents(item);
      });

      this.accountNav = {
        name: 'Account', path: null, subItems: [
          new NavigationItem([], '/member/profile', 'Profile', 0, [], [], null),
          new NavigationItem([], '/sales/orders', 'Orders', 0, [], [], null),
          new NavigationItem([], '/account/payments', 'Payment Methods', 0, [], [], null),
          new NavigationItem([], '/account/addresses', 'Addresses', 0, [], [], null),
        ]
      }
      navigationItems.forEach(item => {
        this.desktopNavigationItems.push(item);
      });
      this.desktopLinkItems.push(new NavigationItem([], 'account/about', 'Blog', 0, [], [], null));
      this.desktopLinkItems.push(new NavigationItem([], 'account/about', 'About', 0, [], [], null));
      if (this.userService.currentUser.isSeller) {
        this.accountNav.subItems.push(new NavigationItem([], '/sales/sales', 'Sales', 0, [], [], null),
          new NavigationItem([], '/sales/listings', 'Listings', 0, [], [], null),
        );
      }
      this.accountNav.subItems.push(new NavigationItem([], '/account/settings', 'Settings', 0, [], [], null),
        new NavigationItem([], '/account/terms', 'Terms of Service', 0, [], [], null),
        new NavigationItem([], '/account/help', 'Help', 0, [], [], null),
      );
      navigationItems.push(this.accountNav);
      this.navigationService.rootNavigationItems = navigationItems;
      this.navigationService.setCurrentNavigationItems(navigationItems);

    })
    this.storageService.testLocalStorage();
  }

  ngAfterViewInit() {
    const content = document.querySelector('.mat-sidenav-content');
    const scroll$ = fromEvent(content, 'scroll').pipe(
      throttleTime(10), // only emit every 10 ms
      map(() => content.scrollTop) // get vertical scroll positio
    );

    scroll$.subscribe(result => {
      if (result <= this.top) {
        if (result === 0) {
          this.scroll0 = true;
        }
        this.scrolledToTop = true;
      } else if (this.scrolledToTop) {
        this.scroll0 = false;
        this.scrolledToTop = false;
      }
    });
  }


  setParents(parent: NavigationItem, child?: NavigationItem) {
    this.categoryService.categoryLookup[parent.id.toString()] = parent;
    if (parent.subItems) {
      parent.subItems.forEach(item => {
        item.parent = parent;
        this.setParents(item);
      })
    }
  }

  public onToggleSearchBar() {
    this.showSearch = !this.showSearch;
  }

  public onGoToFavorites() {
    this.navigationService.navigate({ path: '/member/favorites' })
  }

  public onGoToCart() {
    this.navigationService.navigate({ path: '/sales/cart' })
  }

  public onGoHome() {
    this.navigationService.navigate({ path: '/' })
  }

  public onOpenMegaMenu(item: NavigationItem) {
    this.showMegaMenu = true;
    this.selectedDesktopNavSubItems = item.subItems;
  }

  public onLeaveMenuBar(event: any) {
    if (event.offsetY < 0 || event.offsetX <= 0 || event.offsetX >= 432) {
      this.showMegaMenu = false;
    }
  }

  public onLeaveMegaMenu(event: any) {
    if (event.offsetY >= 100 || event.offsetX <= 0 || event.offsetX >= 432) {
      this.showMegaMenu = false;
    }
  }

  public onLeaveAccountMenu(event: any) {
    console.log(event);
    this.trigger.closeMenu();
  }

  public toggleProfile() {
    this.showProfile = !this.showProfile;
  }

  public toggleHeader() {
    this.showHeader = !this.showHeader;
  }

  public openSidenav() {
    this.sidenavOpen = true;
    this.showOverlay = true;
  }

  public closeSidenav() {
    this.sidenavOpen = false;
    this.showOverlay = false
  }

  public toggleProductMode() {
    this.navigationService.toggleProductMode();
  }

  public navigate(item: NavigationItem) {
    if (this.showMegaMenu) {
      this.showMegaMenu = false;
    }
    this.navigationService.navigate(item);
  }

  public sideNavigate(item: NavigationItem) {
    const close = this.navigationService.sideNavigate(item);
    if (close) {
      this.closeSidenav();
    }
  }

  public goBack(item: NavigationItem) {
    this.navigationService.setCurrentNavigationItems(this.navigationService.rootNavigationItems);
  }
}
