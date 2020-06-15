import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { UserService } from '@app/shared/services/user/user.service';
import { ProductService } from '@app/shared/services/product/product.service';
import { Product } from '@app/shared/models/product.model';
import { UserAuth } from '@app/shared/models/user-auth.model';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListingsComponent implements OnInit {

  constructor(private navigationService: NavigationService,
    private userService: UserService,
    private productService: ProductService,
    private ref: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver) { }

  mobile: boolean;
  public products: Product[];
  public user: UserAuth;


  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.mobile = result.matches;
    })
    this.navigationService.showNavBar(true, 'LISTINGS');
    this.user = this.userService.user$.value;
    this.productService.getListings().subscribe(response => {
      this.products = response.items;
      this.ref.markForCheck();
    })
  }
}
