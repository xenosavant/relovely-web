import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { womensSizes } from '@app/data/sizes.data';
import { colors } from '@app/data/colors.data';
import { ColorFilter } from '@app/shared/interfaces/color-filter.interface';
import { PriceFilter } from '@app/shared/models/price-filter.model';
import { prices } from '@app/data/prices.data';


@Component({
  selector: 'app-desktop-filters',
  templateUrl: './desktop-filters.component.html',
  styleUrls: ['./desktop-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesktopFiltersComponent implements OnInit {

  sizeFilters = womensSizes;
  colors = colors;
  selectedColors: string[] = [];

  selectedPriceFilterIds: string[] = [];
  priceFilters = prices;


  constructor() { }

  ngOnInit() {
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

}
