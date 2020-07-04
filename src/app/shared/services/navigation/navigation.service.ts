import { Injectable } from '@angular/core';
import { NavigationItem } from '../../models/navigation-item.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { Category } from '../../models/category.model';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { trigger } from '@angular/animations';
import { INavigationState } from '../../interfaces/navigation-state.interface';
import { LookupService } from '../lookup/lookup.service';
import { IAuthItem } from './auth-item.interface';
import { KeyValue } from '@angular/common';
import { OverlayService } from '../overlay.service';

@Injectable({ providedIn: 'root' })
export class NavigationService {

    private _navigationStack: NavigationItem[] = [];
    private _currentNavigationItem: NavigationItem;
    private _previousNavigationItem: NavigationItem;

    private _navConfig: INavigationState = {
        showNavBar: false,
        pageHeader: '',
        navigationHeader: '',
        showFilterBar: false,
        showProductGrid: true,
        categoryItems: [],
        chipItems: [],
        selectedCategoryId: null,
        selectedCategory: null
    }

    public scrollSubject$ = new Subject<number>();


    private navConfigSubject$ = new Subject<INavigationState>();
    public navConfig$ = this.navConfigSubject$.asObservable();

    public currentNavSubject$ = new BehaviorSubject<NavigationItem>(null);

    private authWindowSubject$ = new Subject<IAuthItem>();
    public showAuthWindow$ = this.authWindowSubject$.asObservable();

    public rootNavigationItems: NavigationItem[];

    public get navigationStack() {
        return this._navigationStack;
    }

    public back: boolean = false;

    constructor(private router: Router,
        private lookupService: LookupService,
        private overlayService: OverlayService) {
        this.router.events.pipe(
            filter(
                (event: any) => {
                    const ev = event as NavigationEnd;
                    if (ev) {
                        if (document) {
                            const el = document.querySelector('.mat-sidenav-content');
                            if (el) {
                                el.scroll({ top: 0, left: 0 });
                            }
                        }
                    }
                    return (event instanceof NavigationStart);
                }))
            .subscribe(
                (event: NavigationStart) => {
                    if (event.navigationTrigger === 'popstate') {
                        this.overlayService.close();
                        if (this._navigationStack.length > 1) {
                            this.back = true;
                            this.overlayService.close();
                            this._previousNavigationItem = this._navigationStack.pop();
                            this._currentNavigationItem = this._navigationStack[this._navigationStack.length - 1];
                            this.navigate(this._currentNavigationItem, true);
                        }
                    } else {
                        this.back = false;
                    }
                });
    }

    public navigate(item: NavigationItem, back = false, replace = false): boolean {
        if (item.path.startsWith('https')) {
            window.location.assign(item.path);
        } else {
            const params = item.queryStrings;
            if (item.id === "-1") {
                this._navConfig.pageHeader = 'All Products';
                this._navConfig.showFilterBar = true;
                this._navConfig.selectedCategory = { id: '-1', name: 'All Products', parent: null, children: [] };
                this._navConfig.chipItems = [];
                this.navConfigSubject$.next(this._navConfig);
                this.goto(item, back, replace, params);
            }
            else if (item.id) {
                this._navConfig.selectedCategory = this.lookupService.getCategory(item.id);
                this._navConfig.selectedCategoryId = item.id;
                this._navConfig.showFilterBar = true;
                if (item.parent) {
                    if (item.name.startsWith('All')) {
                        this._navConfig.chipItems = item.parent.subItems;
                        this._navConfig.pageHeader = item.name;
                    } else if (item.subItems && item.subItems.length) {
                        this._navConfig.pageHeader = item.parent ? item.parent.plural + ' ' + item.name : item.name;
                        this._navConfig.chipItems = item.subItems;
                    }
                    else if (item.parent.parent) {
                        this._navConfig.chipItems = item.parent.subItems;
                        this._navConfig.pageHeader = item.parent.parent.plural + ' ' + item.parent.name;
                    }
                } else {
                    this._navConfig.chipItems = [];
                    this._navConfig.pageHeader = item.plural + ' ' + 'Clothing';
                }
                this.goto(item, back, replace, params);

                this.navConfigSubject$.next(this._navConfig);
                return true;
            } else {
                this._navConfig.showFilterBar = false;
                this.goto(item, back, replace, params);
                return true;
            }
        }
    }

    private goto(navigationItem: NavigationItem, back: boolean, replace: boolean, queryParams: KeyValue<string, string>[] = null) {
        this._navConfig.categoryItems = navigationItem.subCategories;
        if (navigationItem.id) {
            this._navConfig.showFilterBar = true;
            this._navConfig.showNavBar = true;
        } else {
            this._navConfig.showFilterBar = false;
            this._navConfig.showNavBar = false;
        }
        if (!back) {
            if (!replace) {
                this._navigationStack.push(navigationItem);
            }
            if (!this._currentNavigationItem || this._currentNavigationItem.path !== navigationItem.path) {
                this._currentNavigationItem = navigationItem;
                this.currentNavSubject$.next(this._currentNavigationItem);
            }
            // const queryParamsHandling = this._currentNavigationItem.id && navigationItem.id === this._currentNavigationItem.id ?  'preserve';
            let parsedParams = {};
            if (!navigationItem.queryStrings) {
                parsedParams = { search: null, type: null, page: null }
            } else if (navigationItem.queryStrings) {
                navigationItem.queryStrings.forEach(element => {
                    parsedParams[element.key] = element.value;
                });
            }
            this.router.navigate([navigationItem.path], { queryParams: parsedParams, queryParamsHandling: 'merge' });
        }
        this.navConfigSubject$.next(this._navConfig);
    }

    public hideAll() {
        this.showNavBar(false);
        this.showFilterBar(false);
    }

    public showNavBar(show: boolean, header: string = null, center: boolean = false) {
        this._navConfig.showNavBar = show;
        if (header) {
            this._navConfig.pageHeader = header;
        }
        this.navConfigSubject$.next(this._navConfig);
    }

    public showFilterBar(show: boolean) {
        this._navConfig.showFilterBar = show;
        this.navConfigSubject$.next(this._navConfig);
    }

    public toggleProductMode() {
        this._navConfig.showProductGrid = !this._navConfig.showProductGrid;
        this.navConfigSubject$.next(this._navConfig);
    }

    public getNavigationItem() {
        return this._currentNavigationItem;
    }

    public getPreviousNavigationItem() {
        return this._previousNavigationItem;
    }

    public openAuthWindow(item: IAuthItem) {
        this.authWindowSubject$.next(item);
    }

    public closeAuthWindow() {
        this.authWindowSubject$.next({});
    }

    public resetNavigation() {
        this._navigationStack = [];
    }

    public setScrollPosition(number) {
        this._currentNavigationItem.scrollPosition = number;
    }

    public setData(data: any) {
        this._currentNavigationItem.data = data;
    }

    public getCurrentScrollPosition() {
        return this._currentNavigationItem.scrollPosition;
    }

    public scrollToPosition(position: number) {
        this.scrollSubject$.next(position);
    }
}
