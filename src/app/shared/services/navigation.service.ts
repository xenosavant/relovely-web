import { Injectable } from '@angular/core';
import { NavigationItem } from '../models/navigation-item.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { Category } from '../models/category.model';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { trigger } from '@angular/animations';
import { INavigationState } from '../interfaces/navigation-state.interface';
import { LookupService } from './lookup/lookup.service';

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

    private currentNavSubject$ = new Subject<NavigationItem>();
    public currentNavConfig$ = this.currentNavSubject$.asObservable();

    private authWindowSubject$ = new Subject<boolean>();
    public showAuthWindow$ = this.authWindowSubject$.asObservable();

    public rootNavigationItems: NavigationItem[];

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
        if (item.id === "-1") {
            this._navConfig.pageHeader = 'All Products';
            this._navConfig.showFilterBar = true;
            this._navConfig.chipItems = item.subItems.slice(0, 3);
            this.goto(item, back);
        }
        else if (item.id) {
            this._navConfig.selectedCategory = this.lookupService.getCategory(item.id);
            this._navConfig.selectedCategoryId = item.id;
            this._navConfig.showFilterBar = true;
            if (item.parent) {
                if (item.subItems && item.subItems.length) {
                    this._navConfig.pageHeader = item.parent ? item.parent.plural + ' ' + item.name : item.name;
                    this._navConfig.chipItems = item.subItems;
                }
                else {
                    this._navConfig.chipItems = item.parent.subItems;
                    this._navConfig.pageHeader = item.parent.parent.plural + ' ' + item.parent.name;
                }
            }
            const params = {};
            // if (item.queryStrings.length) {
            //     item.queryStrings.forEach(q =>
            //         params[q.key] = q.value);
            // }
            this.goto(item, back);

            this.navConfigSubject$.next(this._navConfig);
            return true;
        } else {
            this._navConfig.showFilterBar = false;
            this.goto(item, back);
            return true;
        }
    }

    public sideNavigate(item: NavigationItem) {
        this._navConfig.selectedCategoryId = item.id;
        this._navConfig.selectedCategory = this.lookupService.getCategory(item.id);
        if (item.subItems && item.subItems.length) {
            this._navConfig.currentNavigationItems = item.subItems;
            this._navConfig.navigationHeader = item.parent ? item.parent.name : item.name;
            this._navConfig.showTopLeveNavigation = false;
            this.navConfigSubject$.next(this._navConfig);
            return false;
        } else return this.navigate(item);
    }

    private goto(navigationItem: NavigationItem, back: boolean) {
        this._navConfig.categoryItems = navigationItem.subCategories;
        if (navigationItem.id) {
            this._navConfig.showFilterBar = true;
            this._navConfig.showNavBar = true;
        } else {
            this._navConfig.showFilterBar = false;
            this._navConfig.showNavBar = false;
        }
        if (!back) {
            const params = {};
            if (navigationItem.queryStrings) {
                navigationItem.queryStrings.forEach(element => {
                    params[element.key] = element.value;
                });
            }
            if (!this._currentNavigationItem || this._currentNavigationItem.path !== navigationItem.path) {
                this._navigationStack.push(navigationItem);
                this._currentNavigationItem = navigationItem;
                this.currentNavSubject$.next(this._currentNavigationItem);
            }
            // const queryParamsHandling = this._currentNavigationItem.id && navigationItem.id === this._currentNavigationItem.id ?  'preserve';

            this.router.navigate([navigationItem.path]);
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

    public init(item: NavigationItem) {
        this._currentNavigationItem = item;
        this.currentNavSubject$.next(this._currentNavigationItem);
    }

    public openAuthWindow() {
        this.authWindowSubject$.next(true);
    }

    public closeAuthWindow() {
        this.authWindowSubject$.next(false);
    }

    public resetNavigation() {
        this._navigationStack = [];
    }
}
