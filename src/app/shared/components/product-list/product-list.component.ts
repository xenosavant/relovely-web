import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef, NgZone, OnDestroy } from '@angular/core';
import { Product } from '@app/shared/models/product.model';
import { Router } from '@angular/router';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { isDefined } from '@angular/compiler/src/util';
import { Subscription } from 'rxjs';
import { ProductService } from '@app/shared/services/product/product.service';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { UserService } from '@app/shared/services/user/user.service';
import { UserAuth } from '@app/shared/models/user-auth.model';
import { ViewportScroller } from '@angular/common';

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
  @Input() user: UserAuth;


  @Output() edit: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() delete: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() unfavorite: EventEmitter<string> = new EventEmitter<string>();
  @Output() goto: EventEmitter<string> = new EventEmitter<string>();

  subscriptions: Subscription[] = [];
  favoriting: boolean = false;
  deleting: boolean = false;

  grid: boolean;

  constructor(private router: Router,
    private zone: NgZone,
    private navigationService: NavigationService,
    private ref: ChangeDetectorRef,
    private productService: ProductService,
    private userService: UserService,
    private viewportScroller: ViewportScroller) {
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
    if (this.user && this.user.favorites.find(id => id === this.product.id)) {
      this.product.favorited = true;
    }
    else {
      this.product.favorited = false;
    }
  }


  goToProfile(event: any) {
    this.navigationService.navigate({ path: '/member/' + this.product.seller.id })
  }

  goToProduct(event: any) {
    this.goto.emit(this.product.id);
    // this.navigationService.navigate({ path: '/products/detail/' + this.product.id })
  }

  onEdit() {
    this.edit.emit(this.product);
  }

  onFavorite() {
    // this.product.favorited = !this.product.favorited;
    if (this.user) {

      this.favoriting = true;
      this.productService.favoriteProduct(this.product.id).subscribe(() => {
        if (this.user.favorites.includes(this.product.id)) {
          this.user.favorites.splice(this.user.favorites.indexOf(this.product.id), 1);
          this.product.favorited = false;
          this.unfavorite.emit(this.product.id);
        } else {
          this.user.favorites.push(this.product.id);
          this.product.favorited = true;
        }
        this.favoriting = false;
        this.ref.markForCheck();
      }, err => {
        this.favoriting = false;
        this.ref.markForCheck();
      })
    }
    else {
      this.navigationService.navigate({ path: '/' });
      this.navigationService.openAuthWindow({ page: 'signin' });
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => {
      s.unsubscribe();
    })
  }

  onDelete() {
    this.deleting = true;
    this.productService.deleteProduct(this.product.id).subscribe(() => {
      this.delete.emit(this.product);
      this.deleting = false;
    }, err => {
      this.deleting = false;
    })
  }

  purchase() {
    if (this.user) {
      this.navigationService.navigate({ path: `/sales/checkout/${this.product.id}` });
    } else {
      this.navigationService.openAuthWindow({ page: 'signin', redirect: `/sales/checkout/${this.product.id}` });
    }
  }

}
