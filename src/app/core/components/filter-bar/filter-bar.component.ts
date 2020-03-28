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
  selectedPriceFilterIds: string[] = [];
  sizeFilters: SizeFilterGroup[];
  currentSizeFilters: SizeFilterGroup[];
  colorFilters: ColorFilter[];
  priceFilters: PriceFilter[];
  buy = false;
  bid = false;

  constructor(private navigationService: NavigationService,
    private route: ActivatedRoute,
    private router: Router,
    private lookupService: LookupService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.colorFilters = colors;
    this.priceFilters = prices;
    this.navigationService.navConfig$.subscribe(navigationState => {
      this.lookupService.getState().then(lookupState => {
        this.selectedCategoryFilterId = navigationState.selectedCategoryId;
        this.currentSizeFilters = lookupState.sizes.filter(size => {
          return size.categoryIds.indexOf(navigationState.selectedCategory.id) > -1
        });
        this.ref.markForCheck();
      });
    });
    const params = this.route.snapshot.queryParams;
    if (params['size']) {
      const selected = params['size'] as string[];
      this.currentSizeFilters.forEach(size => {
        const matches = size.filters.map(f => f.key).filter(keys => selected.includes(keys));
        if (matches) {
          size.selectedKeys = matches;
        }
      })
    }
  }

  navigate(item: NavigationItem) {
    this.selectedCategoryFilterId = item.id;
    this.router.navigate(['/products/' + this.selectedCategoryFilterId], {
      relativeTo: this.route,
      queryParamsHandling: 'merge'
    });
  }

  setPriceFilter(filter: PriceFilter) {
    if (this.selectedPriceFilterIds.indexOf(filter.id) > -1) {
      this.selectedPriceFilterIds.splice(this.selectedPriceFilterIds.indexOf(filter.id), 1);
    } else {
      this.selectedPriceFilterIds.push(filter.id);
    }
    const params = {};
    const existing = Object.assign({}, this.route.snapshot.queryParams);
    if (this.selectedPriceFilterIds.length === 0) {
      delete existing.price;
    } else {
      params['price'] = this.selectedPriceFilterIds;
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...existing, ...params },
      replaceUrl: true
    });
  }

  sizeFiltersChanged(ids: string[]) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        size: ids,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  colorFiltersChanged(ids: string[]) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        color: ids,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

}
