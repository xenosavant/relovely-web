import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { NavigationItem } from '@app/shared/models/navigation-item.model';
import { categories } from '@app/data/filter-groups.data';
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
  currentSizeFilters: SizeFilterGroup[];
  colorFilters: ColorFilter[];
  selectedColors: string[] = [];
  priceFilters: PriceFilter[];
  buy = false;
  bid = false;

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
    this.sizeFilters.forEach(filterGroup => {
      if (filterGroup.id === change.id) {
        this.sizeFilters[this.sizeFilters.findIndex(group => group.id === change.id)] = change;
      }
    })
    this.filterService.updateSizes([...new Set([...this.sizeFilters.map(s => s.selectedKeys).reduce((prev, current) => prev.concat(current))])]);
  }

  colorFiltersChanged(ids: string[]) {
    this.filterService.updateColors([...new Set(ids)]);
  }

  navigate(item: NavigationItem) {
    this.selectedCategoryFilterId = item.id;
    this.navigationService.navigate(item);
  }

}
