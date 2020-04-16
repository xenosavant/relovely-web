import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { NavigationItem } from '@app/shared/models/navigation-item.model';
import { categories } from '@app/data/filter-groups.data';
import { SizeFilterGroup } from '@app/shared/models/size-filter-group.model';
import { colors } from '@app/data/colors.data';
import { ColorFilter } from '@app/shared/interfaces/color-filter.interface';
import { NavigationService } from '@app/shared/services/navigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PriceFilter } from '@app/shared/models/price-filter.model';
import { prices } from '@app/data/prices.data';
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
    this.colorFilters = colors;
    this.priceFilters = prices;
    this.navigationService.navConfig$.subscribe(navigationState => {
      this.lookupService.getState().then(lookupState => {
        this.sizeFilters = lookupState.sizes;
        this.selectedCategoryFilterId = navigationState.selectedCategoryId;
        this.currentSizeFilters = lookupState.sizes.filter(size => {
          return size.categoryIds.indexOf(navigationState.selectedCategory.id) > -1
        });
        if (this.userService.currentUser) {
          const state = this.userService.currentUser.preferences;
          if (state) {
            if (state.sizes) {
              state.sizes.forEach(sizeId => {
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
            if (state.colors) {
              this.selectedColors = state.colors;
            }
            if (state.prices) {
              state.prices.forEach(pref => {
                this.selectedPriceFilters.push(
                  this.priceFilters.find(price => price.id === pref.id)
                )
              })
            }
          }
        }
        this.ref.markForCheck();
      });
    });
  }

  setPriceFilter(filter: PriceFilter) {
    const index = this.selectedPriceFilters.indexOf(filter);
    if (index > -1) {
      this.selectedPriceFilters.splice(index, 1);
    } else {
      this.selectedPriceFilters.push(filter);
    }
    this.filterService.updatePrices(this.selectedPriceFilters.map(f => {
      console.log(f);
      return {
        id: f.id,
        min: f.minPrice,
        max: f.maxPrice
      }
    }))
  }

  sizeFiltersChanged(change: any) {
    let sizeArray = [];
    this.sizeFilters.forEach(filter => {
      if (filter.id !== change.groupId) {
        sizeArray.concat(filter.selectedKeys);
      }
    });
    sizeArray = sizeArray.concat(change.selectedIds);
    this.filterService.updateSizes(sizeArray);
  }

  colorFiltersChanged(ids: string[]) {
    this.filterService.updateColors(ids);
  }

  navigate(item: NavigationItem) {
    this.selectedCategoryFilterId = item.id;
    this.navigationService.navigate(item);
  }

}
