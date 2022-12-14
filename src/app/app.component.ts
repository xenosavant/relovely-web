import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild, ElementRef, Inject } from '@angular/core';
import { fromEvent, Subscription, forkJoin, concat, of, from } from 'rxjs';
import { environment as env } from '@env/environment';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NavigationItem } from './shared/models/navigation-item.model';
import { LookupService } from './shared/services/lookup/lookup.service';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationService } from './shared/services/navigation/navigation.service';
import { UserService } from './shared/services/user/user.service';
import { Category } from './shared/models/category.model';
import { throttleTime, map } from 'rxjs/operators';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { TemplatePortal } from '@angular/cdk/portal';
import { OverlayService } from './shared/services/overlay.service';
import { LocalStorageService } from './shared/services/local-storage/local-storage.service';
import { HeaderService } from './shared/services/header.service';
import { AlertService } from './shared/services/alert/alert.service';
import { Product } from './shared/models/product.model';
import { ProductService } from './shared/services/product/product.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('.4s ease-out',
              style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('.4s ease-in',
              style({ opacity: 0 }))
          ]
        )
      ]
    )
  ]
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
  public showMobileHeader = true;

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
  public alertSubsciption: Subscription;
  public signupError: string = null;
  public authPage = 'signin';
  public authToken: string;
  public authUsername: string;
  public authRedirect: string;
  public accountAlert: boolean = false;
  public editProduct: Product = null;
  public productType: 'bundle' | 'item' = 'item';
  public currentUserId: string;
  public productImageUrl: string;
  public content: Element;

  error = false;
  searchTerm: string;
  private _navMap = {};

  get top(): number {
    return ((this.showFilterBar ? 70 : 0) + (this.showNavBar ? 44 : 0));
  }

  @ViewChild('signUpModal', { static: true }) signUpModal: TemplatePortal<any>;
  @ViewChild('applyToSell', { static: true }) applymodal: TemplatePortal<any>;
  @ViewChild('productModal', { static: true }) productModal: TemplatePortal<any>;
  @ViewChild('productImage', { static: true }) productImage: TemplatePortal<any>;
  @ViewChild(MatSidenavContainer, { static: true }) container: MatSidenavContainer;
  @ViewChild('menuTrigger', { read: MatMenuTrigger }) trigger: MatMenuTrigger;
  @ViewChild('.mat-sidenav-content') sideNavContent: ElementRef;

  constructor(
    private lookupService: LookupService,
    private matIconRegistry: MatIconRegistry,
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
    private productService: ProductService,
    private alertService: AlertService,
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: any
  ) {
    this.showFilterBar = false;
    this.showNavBar = false;
    this.showTopLevel = true;
    this.matIconRegistry.addSvgIcon('menu', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/menu.svg'))
      .addSvgIcon('heart', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/heart.svg'))
      .addSvgIcon('search', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/search.svg'))
      .addSvgIcon('grid', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/grid.svg'))
      .addSvgIcon('square', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/square.svg'))
      .addSvgIcon('left-arrow', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/left-arrow.svg'))
      .addSvgIcon('store', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/store.svg'))
      .addSvgIcon('bank', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/bank.svg'))
      .addSvgIcon('home', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/home.svg'))
      .addSvgIcon('plus', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/plus.svg'))
      .addSvgIcon('edit', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/edit.svg'))
      .addSvgIcon('undo', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/undo.svg'))
      .addSvgIcon('clock', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/clock.svg'))
      .addSvgIcon('lock', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/lock.svg'))
      .addSvgIcon('shield', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/shield.svg'))
      .addSvgIcon('sync', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/sync.svg'))
      .addSvgIcon('close', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/close.svg'))
      .addSvgIcon('chevron', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/chevron-down.svg'))
      .addSvgIcon('check', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/check.svg'))
      .addSvgIcon('times', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/times.svg'))
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
      this.chipItems = nav.chipItems;
      this.zone.run(() => {
        this.ref.detectChanges();
      });
    });

    this.navigationService.scrollSubject$.subscribe(value => {
      this.scrollToPosition(value);
    })

    this.productService.showCreateProduct$.subscribe(values => {
      this.editProduct = { ...values.product };
      this.productType = values.type;
      this.overlayService.open(this.productModal);
    })

    this.productService.productModalClosed$.subscribe(success => {
      this.editProduct = null;
      this.overlayService.close();
    });

    this.productService.showImage$.subscribe(url => {
      this.productImageUrl = url;
      this.overlayService.open(this.productImage);
    })

    const jwt = this.localStorageService.getItem('jwt');
    if (jwt) {
      this.userService.jwt = jwt;
      this.userService.me().subscribe(me => {
        if (me) {
          this.userService.setLogin(jwt, me);
          this.currentUserId = me.id;
          if (this.alertSubsciption) {
            this.alertSubsciption.unsubscribe()
          }
          this.resetLoginSubscription();
          this.loading = false;
          this.ref.markForCheck();
        } else {
          if (this.alertSubsciption) {
            this.alertSubsciption.unsubscribe()
          }
          this.userService.logout();
          this.loading = false;
        }
        this.ref.markForCheck();
      }, err => {
        if (this.alertSubsciption) {
          this.alertSubsciption.unsubscribe()
        }
        if (err.status === 401) {
          this.loading = false;
          this.userService.logout();
          this.resetLoginSubscription();
        } else {
          this.error = true;
          this.loading = false;
        }
      })
    } else {
      this.navSetup(this.lookupService.state.categories);
      this.loading = false;
      this.resetLoginSubscription();
      this.ref.markForCheck();
    }
    this.navigationService.showAuthWindow$.subscribe(item => {
      if (item.page) {
        this.authToken = item.token;
        this.authPage = item.page;
        this.authUsername = item.username;
        this.authRedirect = item.redirect;
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

  closeProductModal(event: boolean) {
    this.productService.productModalClosed(event);
  }

  closeImage() {
    this.overlayService.close();
  }

  resetLoginSubscription() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
    this.loginSubscription = this.userService.loggedIn$.subscribe(loggedIn => {
      this.navSetup(this.lookupService.state.categories);
      if (!this.alertSubsciption) {
        this.alertSubsciption = this.alertService.notification$.subscribe(notifications => {
          this.accountAlert = false;
          notifications.forEach(notification => {
            if (notification.menuItem) {
              this.accountNav.subItems.forEach(item => {
                if (item.name === notification.menuItem) {
                  if (notification.alert) {
                    this.accountAlert = true;
                    item.alert = true;
                  } else {
                    item.alert = false;
                  }
                }
              })
            }
          })
          this.accountNav = { ...this.accountNav };
          this.ref.markForCheck();
          this.currentNavigationItems = [this.currentNavigationItems[0], this.currentNavigationItems[1], this.currentNavigationItems[2], this.accountNav];
          this.ref.markForCheck();
        });
      }
      this.loading = false;
      this.ref.markForCheck();
    });
  }

  handleError() {
    this.error = true;
    this.loading = false;
    this.ref.markForCheck();
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

    this.desktopNavigationItems = desktopNavigationItems;

    const accountNav = {
      name: 'Account', path: null, subItems: [
        new NavigationItem([], '/member/profile', 'Profile', null, [], [], null),
        new NavigationItem([], '/sales/orders', 'Orders', null, [], [], null),
        new NavigationItem([], '/account/payments', 'Payment Methods', null, [], [], null),
        new NavigationItem([], '/account/addresses', 'Addresses', null, [], [], null)
      ]
    }

    const user = this.userService.user$.getValue();
    if (user && user.type === 'seller') {
      accountNav.subItems.push(
        new NavigationItem([], '/account/settings', 'Settings', null, [], [], null),
        new NavigationItem([], '/sales/sales', 'Sales', null, [], [], null),
        new NavigationItem([], '/member/listings', 'Listings', null, [], [], null),
      );
      if (!user.seller.missingInfo.includes('external_account') &&
        user.seller.verificationStatus === 'verified' && !!user.returnAddress) {
        accountNav.subItems.push(new NavigationItem([], '', 'List A Product', null, [], [], null))
        accountNav.subItems.push(new NavigationItem([], '', 'Create A Bundle', null, [], [], null))
      }
    }
    if (user && user.admin) {
      accountNav.subItems.push(new NavigationItem([], '/admin/dashboard', 'Admin', null, [], [], null));
    }
    accountNav.subItems.push(
      new NavigationItem([], '/member/terms', 'Terms of Service', null, [], [], null),
      new NavigationItem([], '/account/signout', 'Sign Out', null, [], [], null),
    );
    this.accountNav = accountNav;
    navigationItems.push(this.accountNav);
    if (user && user.type === 'seller' && !user.seller.missingInfo.includes('external_account') &&
      user.seller.verificationStatus === 'verified' && !!user.returnAddress) {
      navigationItems.push({ name: 'List A Product', path: '' });
      navigationItems.push({ name: 'Create A Bundle', path: '' });
    }
    navigationItems.push({ name: 'Blog', path: 'https://www.blog.relovely.com/' });
    this.navigationService.rootNavigationItems = navigationItems;
    this.currentNavigationItems = navigationItems
  }

  goToAbout() {
    this.navigationService.navigate({ path: '/about' });
  }

  goToBlog() {
    window.location.assign('https://www.blog.relovely.com/');
  }

  ngAfterViewInit() {
    this.resetScrollSubscription();
  }

  private resetScrollSubscription() {
    if (this.scrollSubscription$) {
      this.scrollSubscription$.unsubscribe();
    }
    this.content = document.querySelector('.mat-sidenav-content');
    if (this.content) {
      const scroll = fromEvent(this.content, 'scroll', { passive: true }).pipe(
        throttleTime(200), // only emit every 10 ms
        map(() => this.content.scrollTop) // get vertical scroll positio
      );

      this.scrollSubscription$ = scroll.subscribe(result => {
        this.navigationService.setScrollPosition(result);
      });
    }
    else {
      this.content = document.querySelector('.theme-wrapper');
      if (this.content) {
        const scroll = fromEvent(this.content, 'scroll', { passive: true }).pipe(
          throttleTime(200), // only emit every 10 ms
          map(() => this.content.scrollTop) // get vertical scroll positio
        );

        this.scrollSubscription$ = scroll.subscribe(result => {
          this.navigationService.setScrollPosition(result);
        });
      }
    }
  }

  scrollToPosition(position: number) {
    this.content.scrollTo(0, position);
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

  public onOpenSearch() {
    this.showSearch = true;
  }

  public onCloseSearch() {
    this.showSearch = false;
    this.searchTerm = null;
  }

  public goToFavorites() {
    this.navigationService.navigate({ path: '/member/favorites' })
  }

  public onFavoritesClicked() {
    if (this.userService.user$.getValue()) {
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
    if (item.name === 'List A Product') {
      this.productType = 'item';
      this.overlayService.open(this.productModal);
    } else if (item.name === 'Create A Bundle') {
      this.productType = 'bundle';
      this.overlayService.open(this.productModal);
    } else {
      this.navigationService.navigate({ path: item.path, name: item.name });
    }
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
    this.showTopLevel = true;
    this.currentNavigationItems = this.navigationService.rootNavigationItems;
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
    if (item.name === 'Blog') {
      this.sidenavOpen = false;
      this.showOverlay = false
      this.navigationService.navigate(item);
    } else if (item.name === 'List A Product') {
      this.sidenavOpen = false;
      this.showOverlay = false
      this.productType = 'item';
      this.overlayService.open(this.productModal);
    }
    else if (item.name === 'Create A Bundle') {
      this.sidenavOpen = false;
      this.showOverlay = false
      this.productType = 'bundle';
      this.overlayService.open(this.productModal);
    } else if (!this.userService.user$.getValue() && item.name === 'Account') {
      this.sidenavOpen = false;
      this.showOverlay = false
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
    if (this.currentNavigationItems[0].parent && this.currentNavigationItems[0].parent.parent) {
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
    if (this.authRedirect) {
      this.navigationService.navigate({ path: this.authRedirect });
      this.authRedirect = null;
    }
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
    this.navigationService.navigate({ path: '/help' });
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
    const firstChild = this.route.snapshot.children[0];
    this.showSearch = false;
    if (firstChild.routeConfig.path === 'products' && !firstChild.children[0].routeConfig.path.startsWith('detail')) {
      this.router.navigate([], { queryParams: { search: this.searchTerm }, queryParamsHandling: 'merge', relativeTo: this.route });
    } else {
      this.navigationService.navigate({ path: `/products`, queryStrings: [{ key: 'search', value: this.searchTerm }] });
    }
  }
}
