import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef, NgZone, OnDestroy } from '@angular/core';
import { Product } from '@app/shared/models/product.model';
import { Router } from '@angular/router';
import { NavigationService } from '@app/shared/services/navigation.service';
import { isDefined } from '@angular/compiler/src/util';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit, OnDestroy {

  @Input() product: Product;
  @Input() showGrid?: boolean;
  @Input() showHeader = true;
  @Input() seller = false;

  @Output() edit: EventEmitter<Product> = new EventEmitter<Product>();

  subscriptions: Subscription[] = [];

  grid: boolean;

  constructor(private router: Router, private zone: NgZone, private navigationService: NavigationService, private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    if (!isDefined(this.showGrid)) {
      this.subscriptions.push(
        this.navigationService.navConfig$.subscribe(val => {
          this.grid = val.showProductGrid;
          this.zone.run(() => {
            this.ref.detectChanges();
          });
        }));
    } else {
      this.grid = this.showGrid;
    }
  }


  goToProfile(event: any) {
    this.navigationService.navigate({ path: '/member/' + this.product.seller.id })
  }

  goToProduct(event: any) {
    this.navigationService.navigate({ path: '/products/detail/' + this.product.id })
  }

  onEdit() {
    this.edit.emit(this.product);
  }

  favorite() {
    this.product.favorited = !this.product.favorited;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => {
      s.unsubscribe();
    })
  }



}
