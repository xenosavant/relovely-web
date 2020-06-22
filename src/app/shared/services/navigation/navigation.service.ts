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

@Injectable({ providedIn: 'root' })
export class NavigationService {

    private _navigationStack: NavigationItem[] = [];
    private _currentNavigationItem: NavigationItem;

    private _navConfig: INavigationState = {
        showNavBar: false,
        showTopLeveNavigation: true,
        pageHeader: '',
        navigationHeader: '',
        showFilterBar: false,
        showProductGrid: true,
        categoryItems: [],
        chipItems: [],
        selectedCategoryId: null,
        currentNavigationItems: [],
        selectedCategory: null
    }
    private navConfigSubject$ = new Subject<INavigationState>();
    public navConfig$ = this.navConfigSubject$.asObservable();

    public currentNavSubject$ = new BehaviorSubject<NavigationItem>(null);

    private authWindowSubject$ = new Subject<IAuthItem>();
    public showAuthWindow$ = this.authWindowSubject$.asObservable();

    public rootNavigationItems: NavigationItem[];

    public get navigationStack() {
        return this._navigationStack;
    }

    constructor(private router: Router, private lookupService: LookupService) {
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
                    if (event.navigationTrigger === 'popstate' && this._navigationStack.length > 1) {
                        this._navigationStack.pop();
                        this._currentNavigationItem = this._navigationStack[this._navigationStack.length - 1]
                        this.navigate(this._currentNavigationItem, true);
                    }
                });
    }

    public navigate(item: NavigationItem, back = false): boolean {
        const params = item.queryStrings;
        console.log(item.id)
        if (item.id === "-1") {
            this._navConfig.pageHeader = 'All Products';
            this._navConfig.showFilterBar = true;
            this._navConfig.selectedCategory = { id: '-1', name: 'All Products', parent: null, children: [] };
            this._navConfig.chipItems = [];
            this.navConfigSubject$.next(this._navConfig);
            this.goto(item, back, params);
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
            this.goto(item, back, params);

            this.navConfigSubject$.next(this._navConfig);
            return true;
        } else {
            this._navConfig.showFilterBar = false;
            this.goto(item, back, params);
            return true;
        }
    }

    private goto(navigationItem: NavigationItem, back: boolean, queryParams: KeyValue<string, string>[] = null) {
        this._navConfig.categoryItems = navigationItem.subCategories;
        if (navigationItem.id) {
            this._navConfig.showFilterBar = true;
            this._navConfig.showNavBar = true;
        } else {
            this._navConfig.showFilterBar = false;
            this._navConfig.showNavBar = false;
        }
        if (!back) {
            if (!this._currentNavigationItem || this._currentNavigationItem.path !== navigationItem.path) {
                this._navigationStack.push(navigationItem);
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
        this._navConfig.showTopLeveNavigation = true;
        this._navConfig.currentNavigationItems = this.rootNavigationItems;
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

    public setCurrentNavigationItems(items: NavigationItem[]) {
        this._navConfig.currentNavigationItems = items;
        this._navConfig.showTopLeveNavigation = true;
        this.navConfigSubject$.next(this._navConfig);
    }

    public getNavigationItem() {
        return this._currentNavigationItem;
    }

    public getNavigationItems() {
        return this._navConfig.currentNavigationItems;
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
}
