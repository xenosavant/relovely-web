import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { NavigationItem } from '@app/shared/models/navigation-item.model';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbsComponent implements OnChanges {

  crumbs: NavigationItem[];
  @Input() navItem: NavigationItem;
  @Input() items: NavigationItem[];

  constructor(private navigationService: NavigationService) { }

  ngOnChanges() {
    this.crumbs = [];
    this.crumbs.push({ path: '/', name: 'Home' });
    if (this.navItem) {
      let currentItem = this.navItem;
      if (currentItem.id && currentItem.id !== '-1') {
        this.crumbs.push({ path: '/products', name: 'All Products' });
      }
      const navStack = [];
      while (currentItem) {
        if (!(currentItem.name && currentItem.name.startsWith('All') && currentItem.name !== 'All Products')) {
          navStack.push(currentItem);
        }
        currentItem = currentItem.parent;
      }
      const length = navStack.length
      for (let i = 0; i < length; i++) {
        this.crumbs.push(navStack.pop());
      }
    } else {
      this.items.forEach(item => {
        this.crumbs.push(item);
      })
    }
  }

  public navigate(item: NavigationItem) {
    this.navigationService.navigate(item);
  }
}
