
import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { colors } from '@app/data/colors.data';
import { ColorFilter } from '@app/shared/interfaces/color-filter.interface';
import { PriceFilter } from '@app/shared/models/price-filter.model';
import { prices } from '@app/data/prices.data';
import { MatMenuTrigger } from '@angular/material';
import { NavigationService } from '@app/shared/services/navigation.service';
import { LookupService } from '@app/shared/services/lookup/lookup.service';
import { SizeFilterGroup } from '@app/shared/models/size-filter-group.model';


@Component({
  selector: 'app-desktop-filters',
  templateUrl: './desktop-filters.component.html',
  styleUrls: ['./desktop-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesktopFiltersComponent implements OnInit {

  sizeFilters: SizeFilterGroup[];
  currentSizeFilters: SizeFilterGroup[];
  colors = colors;
  selectedColors: string[] = [];

  selectedPriceFilterIds: string[] = [];
  priceFilters = prices;

  @ViewChild('sizeTrigger', { static: true }) sizeTrigger: MatMenuTrigger;
  @ViewChild('colorTrigger', { static: true }) colorTrigger: MatMenuTrigger;
  @ViewChild('priceTrigger', { static: true }) priceTrigger: MatMenuTrigger;
  @ViewChild('listingsTrigger', { static: true }) listingsTrigger: MatMenuTrigger;

  private _activeTrigger: MatMenuTrigger;

  constructor(private navigationService: NavigationService,
    private ref: ChangeDetectorRef,
    private lookupService: LookupService) { }

  ngOnInit() {
    this.navigationService.navConfig$.subscribe(navigationState => {
      this.lookupService.getState().then(state => {
        this.sizeFilters = state.sizes;
        this.currentSizeFilters = this.sizeFilters.filter(size => {
          return size.categoryIds.indexOf(navigationState.selectedCategory.id) > -1
        });
        this.ref.markForCheck();
      })
    });
  }

  selectColor(color: ColorFilter) {
    if (this.selectedColors.indexOf(color.key) > -1) {
      this.selectedColors.splice(this.selectedColors.indexOf(color.key), 1);
    } else {
      this.selectedColors.push(color.key);
    }
  }

  setPriceFilter(filter: PriceFilter) {
    if (this.selectedPriceFilterIds.indexOf(filter.id) > -1) {
      this.selectedPriceFilterIds.splice(this.selectedPriceFilterIds.indexOf(filter.id), 1);
    } else {
      this.selectedPriceFilterIds.push(filter.id);
    }
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
        this._activeTrigger = this['sizeTrigger'];
        break;
      case 'color':
        this._activeTrigger = this['colorTrigger'];
        break;
      case 'price':
        this._activeTrigger = this['priceTrigger'];
        break;
      // case 'listings':
      //   this._activeTrigger = menuElement = this['listingsTrigger'];
      //   break;
    }

    if (!this._activeTrigger.menuOpen) {
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
