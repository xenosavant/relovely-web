import browser from 'browser-detect';
import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild, ElementRef, Inject } from '@angular/core';
import { Observable, BehaviorSubject, fromEvent, Subscription, forkJoin, concat, of, from } from 'rxjs';
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
import { NavigationService } from './shared/services/navigation/navigation.service';
import { UserService } from './shared/services/user/user.service';
import { Category } from './shared/models/category.model';
import { products } from './data/products.data';
import { timeInterval, timeout, throttleTime, map, pairwise, tap, switchMap, concatMap, mergeMap, concatAll } from 'rxjs/operators';
import { Direction } from '@angular/cdk/bidi/typings/directionality';
import { MatSidenavContainer, MatMenuTrigger } from '@angular/material';
import { TemplatePortal } from '@angular/cdk/portal';
import { OverlayService } from './shared/services/overlay.service';
import { LocalStorageService } from './shared/services/local-storage/local-storage.service';
import { LookupResponse } from './shared/services/lookup/lookup.response';
import { IUserPreferences } from './shared/services/filter/filter-state';
import { HeaderService } from './shared/services/header.service';
import { LookupState } from './shared/services/lookup/lookup-state';
import { ParseSpan } from '@angular/compiler';

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
  public showMobileHeader = true;;


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
  public loginSubscription: Subscription;
  public signupError: string = null;
  public authPage = 'signin';
  public authToken: string;
  public authUsername: string;
  error = false;
  searchTerm: string;
  private _navMap = {};

  get top(): number {
    return ((this.showFilterBar ? 70 : 0) + (this.showNavBar ? 44 : 0));
  }

  @ViewChild('signUpModal', { static: true }) signUpModal: TemplatePortal<any>;
  @ViewChild('applyToSell', { static: true }) applymodal: TemplatePortal<any>;
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
    private headerService: HeaderService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(DOCUMENT) private document: any
  ) {
    this.showFilterBar = false;
    this.showNavBar = false;
    this.showTopLevel = true;
  }

  ngOnInit(): void {
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.mobile = result.matches;
      if (this.mobile) {
        this.resetScrollSubscription();
      } else if (this.scrollSubscription$) {
        this.scrollSubscription$.unsubscribe();
      }
    })
    this.headerService.headerVisible$.subscribe(hide => {
      this.showMobileHeader = !hide;
    });
    this.navigationService.navConfig$.subscribe(nav => {
      this.categoryFilters = nav.categoryItems;
      this.navHeader = nav.navigationHeader;
      this.header = nav.pageHeader;
      this.showNavBar = nav.showNavBar;
      this.showFilterBar = nav.showFilterBar;
      this.showProductGrid = nav.showProductGrid;
      this.showTopLevel = nav.showTopLeveNavigation;
      this.chipItems = nav.chipItems;
      this.currentNavigationItems = nav.currentNavigationItems;
      this.zone.run(() => {
        this.ref.detectChanges();
      });
    });
    this.loginSubscription = this.userService.loggedIn$.subscribe(loggedIn => {
      console.log(loggedIn)
      this.lookupService.getLookupData().subscribe(value => {
        this.navSetup(value.categories);
        this.loading = false;
        this.ref.markForCheck();
      }, err => {
        this.handleError();
      });
    });
    const jwt = this.localStorageService.getItem('jwt');
    if (jwt) {
      this.userService.jwt = jwt;
      this.userService.me().pipe(tap(me => {
        if (me) {
          this.userService.setLogin(jwt, me);
        } else {
          this.userService.logout();
          this.loading = false;
        }
      }, err => {
        if (err.status === 401) {
          this.loading = false;
        } else {
          this.loading = false;
          this.userService.logout();
        }
      }), mergeMap(value => this.getLookup()))
        .subscribe(final => {
          if (this.loginSubscription) {
            this.loginSubscription.unsubscribe();
          }
        });
    } else {
      this.userService.logout();
      this.lookupService.getLookupData().subscribe(value => {
        this.navSetup(value.categories);
        this.loading = false;
        this.ref.markForCheck();
      }, err => {
        this.handleError();
      });
    }
    this.navigationService.showAuthWindow$.subscribe(item => {
      if (item.page) {
        this.authToken = item.token;
        this.authPage = item.page;
        this.authUsername = item.username;
        if (item.error) {
          this.signupError = item.error;
        } else {
          this.signupError = null;
        }
        this.showSignUpModal()
      } else {
        this.closeModal();
      }
    });
  }

  handleError() {
    this.error = true;
    this.loading = false;
    this.ref.markForCheck();
  }

  getLookup(): Observable<LookupState> {
    return this.lookupService.getLookupData();
  }

  navSetup(cats: Category[]) {
    const navigationItems = [new NavigationItem([], '/products/', 'All Products', '-1', [], [], null), ...cats.map(cat => {
      return new NavigationItem([], '/products/' + cat.id.toString(), cat.name, cat.id,
        [new NavigationItem([], `/products/${cat.id}`, `All  ${cat.plural}`, cat.id, [], [], null, cat.plural), ...cat.children.map(c1 => {
          return new NavigationItem(
            null,
            '/products/' + c1.id.toString(),
            c1.name,
            c1.id,
            [new NavigationItem([], `/products/${c1.id}`, `All ${cat.plural} ${c1.name}`, c1.id, [], [], null, c1.plural), ...c1.children.map(c2 => {
              return new NavigationItem(
                null,
                '/products/' + c2.id.toString(),
                c2.name,
                c2.id,
                [],
                [],
                null)
            })],
            c1.children,
            null
          )
        })],
        [],
        null,
        cat.plural)
    })];

    const desktopNavigationItems = [...cats.map(cat => {
      return new NavigationItem([], '/products/' + cat.id.toString(), cat.name, cat.id,
        [...cat.children.map(c1 => {
          return new NavigationItem(
            null,
            '/products/' + c1.id.toString(),
            c1.name,
            c1.id,
            [...c1.children.map(c2 => {
              return new NavigationItem(
                null,
                '/products/' + c2.id.toString(),
                c2.name,
                c2.id,
                [],
                [],
                null)
            })],
            c1.children,
            null
          )
        })],
        [],
        null,
        cat.plural)
    })];

    navigationItems.forEach(item => {
      this.setParents(item);
    });

    this.desktopLinkItems = [];
    this.desktopNavigationItems = desktopNavigationItems;

    const accountNav = {
      name: 'Account', path: null, subItems: [
        new NavigationItem([], '/member/profile', 'Profile', null, [], [], null),
        new NavigationItem([], '/sales/orders', 'Orders', null, [], [], null),
        new NavigationItem([], '/account/payments', 'Payment Methods', null, [], [], null),
        new NavigationItem([], '/account/addresses', 'Addresses', null, [], [], null),
        new NavigationItem([], '/account/settings', 'Settings', null, [], [], null)
      ]
    }
    this.desktopLinkItems.push(new NavigationItem([], 'about', 'Sell', null, [], [], null));
    this.desktopLinkItems.push(new NavigationItem([], 'about', 'About', null, [], [], null));
    if (this.userService.user$.value && this.userService.user$.value.type === 'seller') {
      accountNav.subItems.push(new NavigationItem([], '/sales/sales', 'Sales', null, [], [], null),
        new NavigationItem([], '/member/listings', 'Listings', null, [], [], null)
      );
    }
    if (this.userService.user$.value && this.userService.user$.value.admin) {
      accountNav.subItems.push(new NavigationItem([], '/admin/dashboard', 'Admin', null, [], [], null));
    };
    accountNav.subItems.push(
      new NavigationItem([], '/member/terms', 'Terms of Service', null, [], [], null),
      new NavigationItem([], '/account/help', 'Help', null, [], [], null),
      new NavigationItem([], '/account/signout', 'Sign Out', null, [], [], null),
    );
    this.accountNav = accountNav;
    console.log(this.accountNav);
    navigationItems.push(this.accountNav);
    this.navigationService.rootNavigationItems = navigationItems;
    this.navigationService.setCurrentNavigationItems(navigationItems);
  }

  goToSell() {
    this.onApply()
  }

  goToAbout() {
    this.navigationService.navigate({ path: '/about' });
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
      // const scroll = fromEvent(content, 'scroll').pipe(
      //   throttleTime(10), // only emit every 10 ms
      //   map(() => content.scrollTop) // get vertical scroll positio
      // );

      // this.scrollSubscription$ = scroll.subscribe(result => {
      //   if (result <= this.top) {
      //     if (result === 0) {
      //       this.scroll0 = true;
      //     }
      //     this.scrolledToTop = true;
      //   } else if (this.scrolledToTop) {
      //     this.scroll0 = false;
      //     this.scrolledToTop = false;
      //   }
      // });
    }
  }

  setParents(parent: NavigationItem) {
    this.lookupService.navLookup[parent.id] = parent;
    // set children for top level here
    if (parent.subItems) {
      parent.subItems.forEach(item => {
        item.parent = parent;
        this.setParents(item);
      })
    } else if (parent.name.startsWith('All')) {
      parent.subItems = parent.parent ? parent.parent.subItems : [];
    }
  }

  public onToggleSearchBar() {
    this.showSearch = !this.showSearch;
  }

  public goToFavorites() {
    this.navigationService.navigate({ path: '/member/favorites' })
  }

  public onFavoritesClicked() {
    if (this.userService.user$.value) {
      this.goToFavorites();
    } else {
      this.showSignin();
    }
  }

  public onGoToCart() {
    this.navigationService.navigate({ path: '/sales/cart' })
  }

  public onGoHome() {
    this.navigationService.navigate({ path: '/' })
  }

  public onAccountMenuAction(item: NavigationItem) {
    this.showMegaMenu = false;
    this.selectedMenuItem = -1;
    this.navigationService.navigate({ path: item.path, name: item.name })
  }

  public onOpenMegaMenu(item: NavigationItem) {
    this.showMegaMenu = true;
    this.selectedDesktopNavSubItems = item.subItems;
    this.selectedMenuItem = this.desktopNavigationItems.indexOf(item);
  }

  public onLeaveMenuBar(event: any) {
    if (event.offsetY < 0 || event.offsetX <= 0 || event.offsetX >= 288) {
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
    this.navHeader = 'Menu';
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
    if (!this.userService.user$.value && item.name === 'Account') {
      this.showSignin();
    } else {
      const close = item.subItems.length === 0;
      if (close) {
        this.navigationService.navigate(item);
        this.closeSidenav();
      } else {
        this.showTopLevel = false;
        this.currentNavigationItems = item.subItems;
        this.navHeader = item.name;
      }
    }
  }

  public goBack() {
    if (this.currentNavigationItems[0].parent.parent) {
      this.sideNavigate(this.currentNavigationItems[0].parent.parent)
    } else {
      this.currentNavigationItems = this.navigationService.rootNavigationItems;
      this.navHeader = 'Menu';
      this.showTopLevel = true;
    }
  }

  public showSignin() {
    this.authPage = 'signin';
    this.showSignUpModal();
  }

  public showSignUpModal() {
    this.overlayService.open(this.signUpModal);
  }

  public closeModal() {
    this.overlayService.close();
  }

  public onApply() {
    this.overlayService.open(this.applymodal);
  }

  public onAbout() {
    this.navigationService.navigate({ path: '/about' })
  }

  public onContact() {

  }

  public onHelp() {

  }

  public onTerms() {
    this.navigationService.navigate({ path: '/member/terms' })
  }

  public onFacebook() {
    window.open('https://www.facebook.com/relovely.us');
  }

  public onInstagram() {
    window.open('https://www.instagram.com/relovely.us');
  }

  public onPrivacy() {
    this.navigationService.navigate({ path: '/member/privacy' })
  }


  setTerm(term: string) {
    this.searchTerm = term;
  }

  search() {
    const path = this.route.snapshot.children[0].routeConfig.path;
    if (path === 'products') {
      this.router.navigate([], { queryParams: { search: this.searchTerm }, queryParamsHandling: 'merge', relativeTo: this.route });
    } else {
      this.navigationService.navigate({ path: `/products`, queryStrings: [{ key: 'search', value: this.searchTerm }] });
    }
  }
}
