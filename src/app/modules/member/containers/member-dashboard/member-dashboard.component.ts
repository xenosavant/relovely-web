import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ViewChildren } from '@angular/core';
import { MatTabGroup, MatTab } from '@angular/material';
import { Product } from '@app/shared/models/product.model';
import { products } from '@app/data/products.data';

@Component({
  selector: 'app-member-dashboard',
  templateUrl: './member-dashboard.component.html',
  styleUrls: ['./member-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberDashboardComponent implements OnInit {

  tab_num = 0;
  selected = 0;
  number_tabs = 3;
  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };

  public products: Product[];

  @ViewChild(MatTabGroup, { static: false }) group;
  @ViewChildren(MatTab) tabs;

  constructor() { }

  ngOnInit() {
    this.products = products;
  }


  ngAfterViewInit() {
    this.tab_num = this.tabs.length
  }

  swipe(eType) {
    if (eType === this.SWIPE_ACTION.RIGHT && this.selected > 0) {
      this.selected--;
    }
    else if (eType === this.SWIPE_ACTION.LEFT && this.selected < this.tab_num) {
      this.selected++;
    }
  }



}
