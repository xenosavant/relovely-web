import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { NavigationItem } from '@app/shared/models/navigation-item.model';
import { SizeFilterGroup } from '@app/shared/models/size-filter-group.model';
import { ColorFilter } from '@app/shared/interfaces/color-filter.interface';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PriceFilter } from '@app/shared/models/price-filter.model';
import { LookupService } from '@app/shared/services/lookup/lookup.service';
import { FilterService } from '@app/shared/services/filter/filter.service';
import { UserService } from '@app/shared/services/user/user.service';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterBarComponent implements OnInit {

  @Input()
  categoryFilters: NavigationItem[];

  selectedCategoryFilterId: string;
  selectedPriceFilters: PriceFilter[] = [];
  sizeFilters: SizeFilterGroup[];
  currentSizeFilters: SizeFilterGroup[] = [];
  colorFilters: ColorFilter[];
  selectedColors: string[] = [];
  selectedTypes: string[] = [];
  priceFilters: PriceFilter[];

  constructor(private navigationService: NavigationService,
    private route: ActivatedRoute,
    private router: Router,
    private lookupService: LookupService,
    private userService: UserService,
    private filterService: FilterService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.navigationService.navConfig$.subscribe(navigationState => {
      this.sizeFilters = this.lookupService.state.sizes;
      this.colorFilters = this.lookupService.state.colors;
      this.priceFilters = this.lookupService.state.prices;
      this.selectedCategoryFilterId = navigationState.selectedCategoryId;
      if (navigationState.selectedCategory) {
        this.currentSizeFilters = this.lookupService.state.sizes.filter(size => {
          return navigationState.selectedCategory && navigationState.selectedCategory.id === '-1' || size.categoryIds.indexOf(navigationState.selectedCategory.id) > -1
        });
      }
      if (this.userService.user$.getValue()) {
        const cache = this.userService.user$.getValue().preferences;
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
            this.selectedColors = cache.colors;
          }
          if (cache.prices) {
            cache.prices.forEach(pref => {
              this.selectedPriceFilters.push(
                this.priceFilters.find(price => price.id === pref.id)
              )
            })
          }
          if (cache.types) {
            this.selectedTypes = cache.types;
          }
        }
      }
      this.ref.markForCheck();
    });
  }

  setPriceFilter(filter: PriceFilter, add: boolean) {
    if (add && !this.selectedPriceFilters.some(f => f.id === filter.id)) {
      this.selectedPriceFilters.push(filter);
    } else if (!add) {
      const temp = [];
      this.selectedPriceFilters.forEach(f => {
        if (f.id !== filter.id) {
          temp.push(f);
        }
      });
      this.selectedPriceFilters = temp;
    }

    this.filterService.updatePrices(this.selectedPriceFilters.map(f => {
      return {
        id: f.id,
        min: f.min,
        max: f.max
      }
    }))
  }

  sizeFiltersChanged(change: SizeFilterGroup) {
    this.currentSizeFilters.forEach(filterGroup => {
      if (filterGroup.id === change.id) {
        this.currentSizeFilters[this.currentSizeFilters.findIndex(group => group.id === change.id)] = change;
      }
    })
    this.filterService.updateSizes([...new Set([...this.currentSizeFilters.map(s => s.selectedKeys).reduce((prev, current) => prev.concat(current))])]);
    this.currentSizeFilters = Object.assign([], this.currentSizeFilters);
  }

  colorFiltersChanged(ids: string[]) {
    this.filterService.updateColors([...new Set(ids)]);
  }

  navigate(item: NavigationItem) {
    this.selectedCategoryFilterId = item.id;
    this.navigationService.navigate(item);
  }

  onClearFilters() {
    this.filterService.clear();
    this.selectedColors = [];
    this.selectedPriceFilters = [];
    this.currentSizeFilters.forEach(filter => {
      filter.selectedKeys = [];
    })
    this.selectedTypes = [];
    this.currentSizeFilters = Object.assign([], this.currentSizeFilters);
    this.ref.markForCheck();
  }

  itemChanged() {
    if (this.selectedTypes.includes('item')) {
      this.selectedTypes.splice(this.selectedTypes.indexOf('item'));
    } else {
      this.selectedTypes.push('item');
    }
    this.filterService.updateTypes(this.selectedTypes);
  }

  bundleChanged() {
    if (this.selectedTypes.includes('bundle')) {
      this.selectedTypes.splice(this.selectedTypes.indexOf('bundle'));
    } else {
      this.selectedTypes.push('bundle');
    }
    this.filterService.updateTypes(this.selectedTypes);
  }
  get sizesActive(): boolean {
    return this.currentSizeFilters && this.currentSizeFilters.some(f => f.selectedKeys.length > 0);
  }
  get colorsActive(): boolean {
    return this.selectedColors.length > 0;
  }
  get pricesActive(): boolean {
    return this.selectedPriceFilters.length > 0;
  }

  get typesActive(): boolean {
    return this.selectedTypes.length > 0;
  }

}
