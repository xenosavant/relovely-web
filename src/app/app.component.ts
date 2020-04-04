import browser from 'browser-detect';
import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild, ElementRef, Inject } from '@angular/core';
import { Observable, BehaviorSubject, fromEvent, Subscription } from 'rxjs';
import { environment as env } from '@env/environment';

import {
  ActionSettingsChangeLanguage,
  ActionSettingsChangeAnimationsPageDisabled,
  selectSettingsLanguage,
  selectSettingsStickyHeader
} from './settings';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NavigationItem } from './shared/models/navigation-item.model';
import { LookupService } from './shared/services/lookup/lookup.service';
import { KeyValue, DOCUMENT } from '@angular/common';
import { Router, Navigation, ActivatedRoute } from '@angular/router';
import { NavigationService } from './shared/services/navigation.service';
import { UserService } from './shared/services/user/user.service';
import { Category } from './shared/models/category.model';
import { products } from './data/products.data';
import { timeInterval, timeout, throttleTime, map, pairwise, tap } from 'rxjs/operators';
import { Direction } from '@angular/cdk/bidi/typings/directionality';
import { MatSidenavContainer, MatMenuTrigger } from '@angular/material';
import { TemplatePortal } from '@angular/cdk/portal';
import { OverlayService } from './shared/services/overlay.service';
import { LocalStorageService } from './shared/services/local-storage/local-storage.service';

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
  private scrollSubscription$: Subscription;


  showSearch: boolean = false;
  public loading = true;
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
  public showHeader = false;
  public showMegaMenu = false;
  public selectedMenuItem = -1;

  get top(): number {
    return ((this.showFilterBar ? 70 : 0) + (this.showNavBar ? 44 : 0));
  }

  @ViewChild('signUpModal', { static: true }) signUpModal: TemplatePortal<any>;
  @ViewChild('offsetContent', { static: false }) content: ElementRef;
  @ViewChild(MatSidenavContainer, { static: true }) container: MatSidenavContainer;
  @ViewChild('menuTrigger', { read: MatMenuTrigger, static: false }) trigger: MatMenuTrigger;
  @ViewChild('.mat-sidenav-content', { static: false }) sideNavContent: ElementRef;

  constructor(
    private storageService: LocalStorageService,
    private lookupService: LookupService,
    private breakpointObserver: BreakpointObserver,
    private navigationService: NavigationService,
    private ref: ChangeDetectorRef,
    private zone: NgZone,
    private userService: UserService,
    private overlayService: OverlayService,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: any
  ) {
    this.showFilterBar = false;
    this.showNavBar = false;
    this.showTopLevel = true;
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
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.mobile = result.matches;
      if (this.mobile) {
        this.resetScrollSubscription();
      } else if (this.scrollSubscription$) {
        this.scrollSubscription$.unsubscribe();
      }
    })
    this.lookupService.getLookupData().subscribe(response => {
      const cats = JSON.parse(response.categories.json);
      const navigationItems = cats.map(cat => {
        return new NavigationItem([], '/products/' + cat.id.toString(), cat.name, cat.id,
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
          null,
          cat.plural)
      });

      console.log(navigationItems);

      navigationItems.forEach(item => {
        this.setParents(item);
      });

      console.log(navigationItems);

      this.accountNav = {
        name: 'Account', path: null, subItems: [
          new NavigationItem([], '/member/profile', 'Profile', null, [], [], null),
          new NavigationItem([], '/sales/orders', 'Orders', null, [], [], null),
          new NavigationItem([], '/account/payments', 'Payment Methods', null, [], [], null),
          new NavigationItem([], '/account/addresses', 'Addresses', null, [], [], null),
        ]
      }
      navigationItems.forEach(item => {
        this.desktopNavigationItems.push(item);
      });
      this.desktopLinkItems.push(new NavigationItem([], 'account/about', 'Blog', null, [], [], null));
      this.desktopLinkItems.push(new NavigationItem([], 'account/about', 'About', null, [], [], null));
      if (this.userService.currentUser && this.userService.currentUser.type === 'seller') {
        this.accountNav.subItems.push(new NavigationItem([], '/sales/sales', 'Sales', null, [], [], null),
          new NavigationItem([], '/sales/listings', 'Listings', null, [], [], null),
        );
      }
      this.accountNav.subItems.push(new NavigationItem([], '/account/settings', 'Settings', '0', [], [], null),
        new NavigationItem([], '/account/terms', 'Terms of Service', null, [], [], null),
        new NavigationItem([], '/account/help', 'Help', null, [], [], null),
        new NavigationItem([], '/account/signout', 'Log Out', null, [], [], null),
      );
      navigationItems.push(this.accountNav);
      this.navigationService.showAuthWindow$.subscribe(open => {
        if (open) {
          this.showSignUpModal()
        } else {
          this.closeModal();
        }
      });
      this.navigationService.rootNavigationItems = navigationItems;
      this.navigationService.setCurrentNavigationItems(navigationItems);

    })
    this.storageService.testLocalStorage();
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
      this.loading = false;
      this.zone.run(() => {
        this.ref.detectChanges();
      });
    });
  }

  ngAfterViewInit() {
    this.resetScrollSubscription();
  }

  private resetScrollSubscription() {
    if (this.scrollSubscription$) {
      this.scrollSubscription$.unsubscribe();
    }
    const content = document.querySelector('.mat-sidenav-content');
    if (content) {
      const scroll = fromEvent(content, 'scroll').pipe(
        throttleTime(10), // only emit every 10 ms
        map(() => content.scrollTop) // get vertical scroll positio
      );

      this.scrollSubscription$ = scroll.subscribe(result => {
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
  }


  setParents(parent: NavigationItem) {
    this.lookupService.navLookup[parent.id] = parent;
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

  public goToFavorites() {
    this.navigationService.navigate({ path: '/member/favorites' })
  }

  public onFavoritesClicked() {
    if (this.userService.currentUser) {
      this.goToFavorites();
    } else {
      this.showSignUpModal();
    }
  }

  public onGoToCart() {
    this.navigationService.navigate({ path: '/sales/cart' })
  }

  public onGoHome() {
    this.navigationService.navigate({ path: '/' })
  }

  public onAccountMenuAction(path: string) {
    this.navigationService.navigate({ path: path })
  }

  public onOpenMegaMenu(item: NavigationItem) {
    this.showMegaMenu = true;
    this.selectedDesktopNavSubItems = item.subItems;
    this.selectedMenuItem = this.desktopNavigationItems.indexOf(item);
  }

  public onLeaveMenuBar(event: any) {
    if (event.offsetY < 0 || event.offsetX <= 0 || event.offsetX >= 432) {
      this.showMegaMenu = false;
      this.selectedMenuItem = -1;
    }
  }

  public onLeaveMegaMenu(event: any) {
    if (event.offsetY >= 100 || event.offsetX <= 0 || event.offsetX >= 432) {
      this.showMegaMenu = false;
      this.selectedMenuItem = -1;
    }
  }

  public onLeaveAccountMenu(event: any) {
    this.trigger.closeMenu();
  }

  public onTriggerAccountMenu(event: any) {
    this.trigger.openMenu();
  }

  public onLeaveAccountTrigger(event: any) {
    if (event.offsetY < 60) {
      this.trigger.closeMenu();
    }
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
      this.selectedMenuItem = -1;
    }
    this.navigationService.navigate(item);
  }

  public sideNavigate(item: NavigationItem) {
    if (!this.userService.currentUser && item.name === 'Account') {
      this.showSignUpModal();
    } else {
      const close = this.navigationService.sideNavigate(item);
      if (close) {
        this.closeSidenav();
      }
    }
  }

  public goBack(item: NavigationItem) {
    this.navigationService.setCurrentNavigationItems(this.navigationService.rootNavigationItems);
  }

  public showSignUpModal() {
    this.overlayService.open(this.signUpModal);
  }

  public closeModal() {
    this.overlayService.close();
  }
}
