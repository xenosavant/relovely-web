import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef, NgZone, OnDestroy } from '@angular/core';
import { Product } from '@app/shared/models/product.model';
import { Router } from '@angular/router';
import { NavigationService } from '@app/shared/services/navigation.service';
import { isDefined } from '@angular/compiler/src/util';
import { Subscription } from 'rxjs';
import { ProductService } from '@app/shared/services/product/product.service';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { UserService } from '@app/shared/services/user/user.service';
import { UserAuth } from '@app/shared/models/user-auth.model';

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
  @Output() favorite: EventEmitter<Product> = new EventEmitter<Product>();

  subscriptions: Subscription[] = [];
  favoriting: boolean = false;

  grid: boolean;

  constructor(private router: Router,
    private zone: NgZone,
    private navigationService: NavigationService,
    private ref: ChangeDetectorRef,
    private productService: ProductService,
    private userService: UserService) {
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
    if (this.user.favorites.find(id => id === this.product.id)) {
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
    this.navigationService.navigate({ path: '/products/detail/' + this.product.id })
  }

  onEdit() {
    this.edit.emit(this.product);
  }

  onFavorite() {
    // this.product.favorited = !this.product.favorited;
    this.favoriting = true;
    this.productService.favoriteProduct(this.product.id).subscribe(() => {
      if (this.user.favorites.includes(this.product.id)) {
        this.user.favorites.splice(this.user.favorites.indexOf(this.product.id), 1);
        this.product.favorited = false;
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

  ngOnDestroy() {
    this.subscriptions.forEach(s => {
      s.unsubscribe();
    })
  }

  purchase() {
    this.navigationService.navigate({ path: `/sales/checkout/${this.product.id}` });
  }

}
