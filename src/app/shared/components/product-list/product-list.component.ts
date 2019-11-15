import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Product } from '@app/shared/models/product.model';
import { Router } from '@angular/router';
import { NavigationService } from '@app/shared/services/navigation.service';
import { isDefined } from '@angular/compiler/src/util';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {

  @Input() product: Product;
  @Input() showGrid?: boolean;
  @Input() showHeader = true;

  grid: boolean;

  constructor(private router: Router, private navigationService: NavigationService, private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    if (!isDefined(this.showGrid)) {
      this.navigationService.navConfig$.subscribe(val => {
        this.grid = val.showProductGrid;
        this.ref.detectChanges();
      });
    } else {
      this.grid = this.showGrid;
    }
  }


  goToProfile(event: any) {
    this.navigationService.navigate({ path: '/member/' + this.product.userId })
  }

  goToProduct(event: any) {
    this.navigationService.navigate({ path: '/products/detail/' + this.product.id })
  }

  favorite() {
    this.product.favorited = !this.product.favorited;
  }

}
