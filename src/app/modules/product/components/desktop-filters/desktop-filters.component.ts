
import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { ColorFilter } from '@app/shared/interfaces/color-filter.interface';
import { PriceFilter } from '@app/shared/models/price-filter.model';
import { MatMenuTrigger } from '@angular/material';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { LookupService } from '@app/shared/services/lookup/lookup.service';
import { SizeFilterGroup } from '@app/shared/models/size-filter-group.model';
import { FilterService } from '@app/shared/services/filter/filter.service';
import { UserService } from '@app/shared/services/user/user.service';


@Component({
  selector: 'app-desktop-filters',
  templateUrl: './desktop-filters.component.html',
  styleUrls: ['./desktop-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesktopFiltersComponent implements OnInit {

  sizeFilters: SizeFilterGroup[];
  currentSizeFilters: SizeFilterGroup[];
  colors: ColorFilter[];
  selectedColors: string[] = [];

  selectedPriceFilters: PriceFilter[] = [];
  priceFilters: PriceFilter[];

  @ViewChild('sizeTrigger', { static: true }) sizeTrigger: MatMenuTrigger;
  @ViewChild('colorTrigger', { static: true }) colorTrigger: MatMenuTrigger;
  @ViewChild('priceTrigger', { static: true }) priceTrigger: MatMenuTrigger;
  @ViewChild('listingsTrigger', { static: true }) listingsTrigger: MatMenuTrigger;

  private _activeTrigger: MatMenuTrigger;

  constructor(private navigationService: NavigationService,
    private ref: ChangeDetectorRef,
    private lookupService: LookupService,
    private userService: UserService,
    private filterService: FilterService) { }

  ngOnInit() {
    this.navigationService.navConfig$.subscribe(navigationState => {
      this.lookupService.getState().then(state => {
        this.sizeFilters = state.sizes;
        this.colors = state.colors;
        this.priceFilters = state.prices;
        this.currentSizeFilters = this.sizeFilters.filter(size => {
          return navigationState.selectedCategory && size.categoryIds.indexOf(navigationState.selectedCategory.id) > -1
        });
        if (this.userService.user$.value) {
          const cache = this.userService.user$.value.preferences;
          if (cache) {
            if (cache.sizes) {
              cache.sizes.forEach(sizeId => {
                this.sizeFilters.forEach(filter => {
                  if (filter.filters.some(f =>
                    f.key === sizeId
                  )) {
                    if (!filter.selectedKeys.includes(sizeId)) {
                      filter.selectedKeys.push(sizeId);
                    }
                  }
                })
              });
            }
            if (cache.colors) {
              cache.colors.forEach(color => {
                this.selectedColors.push(color)
              })
            }
            if (cache.prices) {
              const temp = [];
              cache.prices.forEach(pref => {
                temp.push(
                  this.priceFilters.find(price => price.id === pref.id)
                )
              })
              this.selectedPriceFilters = temp;
            }
          }
          this.ref.markForCheck();
        }
      })
    });
  }

  selectSize(group: SizeFilterGroup, key: string) {
    let sizeArray = [];
    this.sizeFilters.forEach(filter => {
      if (filter.id !== group.id) {
        sizeArray.concat(filter.selectedKeys);
      }
    });

    if (group.selectedKeys.some(selectedKey => key === selectedKey)) {
      group.selectedKeys.splice(group.selectedKeys.indexOf(key), 1);
    } else {
      group.selectedKeys.push(key);
    }
    sizeArray = sizeArray.concat(group.selectedKeys);
    this.filterService.updateSizes(sizeArray);
  }

  selectColor(color: ColorFilter) {
    if (this.selectedColors.indexOf(color.key) > -1) {
      this.selectedColors.splice(this.selectedColors.indexOf(color.key), 1);
    } else {
      this.selectedColors.push(color.key);
    }
    this.filterService.updateColors(this.selectedColors);
  }

  setPriceFilter(filter: PriceFilter) {
    if (this.selectedPriceFilters.indexOf(filter) > -1) {
      this.selectedPriceFilters.splice(this.selectedPriceFilters.indexOf(filter), 1);
    } else {
      this.selectedPriceFilters.push(filter);
    }
    this.filterService.updatePrices(this.selectedPriceFilters.map(f => {
      return {
        id: f.id,
        min: f.min,
        max: f.max
      }
    }))
  }

  onLeaveMenu(event: any, menu: string) {
    this.closeActiveMenu();
  }

  onLeaveTrigger(event: any, menu: string) {
    switch (menu) {
      case 'size':
        this._activeTrigger = this['sizeTrigger'];
        break;
      case 'color':
        this._activeTrigger = this['colorTrigger'];
        break;
      case 'price':
        this._activeTrigger = this['priceTrigger'];
        break;
    }
    if (event.offsetX < 0 || event.offsetX > 80 || !(event.offsetY > 20)) {
      this.closeActiveMenu();
    }
  }

  onEnterTrigger(event: any, menu: string) {
    this.closeActiveMenu();
    switch (menu) {
      case 'size':
        if (this.currentSizeFilters && this.currentSizeFilters.length) {
          this._activeTrigger = this['sizeTrigger'];
        } else {
          this._activeTrigger = null;
        }
        break;
      case 'color':
        this._activeTrigger = this['colorTrigger'];
        break;
      case 'price':
        this._activeTrigger = this['priceTrigger'];
        break;
    }

    if (this._activeTrigger && !this._activeTrigger.menuOpen) {
      this._activeTrigger.openMenu();
    }

  }

  onLeaveFilters(event: any) {
    this.closeActiveMenu();
  }

  closeActiveMenu() {
    if (this.sizeTrigger.menuOpen) {
      this.sizeTrigger.closeMenu();
    }
    if (this.colorTrigger.menuOpen) {
      this.colorTrigger.closeMenu();
    }
    if (this.priceTrigger.menuOpen) {
      this.priceTrigger.closeMenu();
    }
  }
}
