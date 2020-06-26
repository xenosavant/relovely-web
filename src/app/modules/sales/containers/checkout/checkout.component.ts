import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@app/shared/services/product/product.service';
import { Product } from '@app/shared/models/product.model';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Address } from '@app/shared/interfaces/address.interface';
import { UserService } from '@app/shared/services/user/user.service';
import { LookupService } from '@app/shared/services/lookup/lookup.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserAuth } from '@app/shared/models/user-auth.model';
import { PaymentCard } from '@app/shared/interfaces/payment-card';
import { PaymentCardType } from '@app/shared/services/lookup/payment-card-map';
import { OrderService } from '@app/shared/services/order/order.service';
import { ShipmentService } from '@app/shared/services/shipment/shipment.service';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { guid } from '../../../../shared/utils/rand';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutComponent implements OnInit {

  product: Product;
  total: number;
  tax: number = 0;
  shippingCost: number = 711;
  mobile = false;
  user: UserAuth;
  selectedAddress: Address;
  selectedPayment: PaymentCard;
  loading = true;
  addingAddress = false;
  changingAddress = false;
  addingPayment = false;
  changingPayment = false;
  states;
  loadingPayment: boolean;
  checkingOut = false;
  shippingCostLoading = true;
  shippingRateId: string;
  shipmentId: string;
  savingAddress = false;
  error: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private userService: UserService,
    private orderService: OrderService,
    private lookupService: LookupService,
    private breakpointObserver: BreakpointObserver,
    private shipmentService: ShipmentService,
    private navigationService: NavigationService,
    private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.navigationService.showNavBar(false);
    this.user = this.userService.user$.getValue();
    if (!this.user) {
      this.navigationService.navigate({ 'path': '/' })
    }
    this.states = this.lookupService.states;
    if (this.user.addresses.length) {
      this.selectedAddress = this.user.addresses.find(a => a.primary);
    } else {
      this.addingAddress = true;
    }

    if (this.user.cards.length) {
      this.selectedPayment = this.user.cards.find(a => a.primary);
    } else {
      this.addingPayment = true;
    }

    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.mobile = result.matches;
    })
    this.activatedRoute.params.subscribe(params => {
      this.productService.getProduct(params['id']).subscribe(product => {
        this.product = product.product;
        this.selectedAddress = this.user.addresses.find(a => a.primary);
        this.recalcCosts();
      });
    })
  }

  recalcCosts() {
    this.shippingCostLoading = true;
    if (this.selectedAddress) {
      this.shipmentService.previewShipment({
        categoryId: this.product.categories.find(c => c.length === 2),
        weight: this.product.weight, toAddress: this.selectedAddress, sellerId: this.product.sellerId, price: this.product.price
      }).subscribe(response => {
        this.shippingCost = response.shippingRate;
        this.total = this.product.price + this.shippingCost;
        this.shippingRateId = response.rateId;
        this.shipmentId = response.shipmentId;
        this.tax = response.taxRate;
        this.shippingCostLoading = false;
        this.loading = false;
        this.ref.markForCheck();
      }, err => {
        this.error = err.error.error.message;
        this.shippingCostLoading = false;
        this.loading = false;
        this.ref.markForCheck();
      });
    } else {
      this.shippingCost = 0;
      this.total = this.product.price + this.shippingCost;
      this.shippingCostLoading = false
      this.loading = false;
      this.ref.markForCheck();
    }
  }

  onSaveAddress(user: UserAuth) {
    this.user = user;
    this.selectedAddress = this.user.addresses.find(a => a.primary);
    this.addingAddress = false;
    this.savingAddress = false;
    this.recalcCosts();
  }

  onSavingAddress(saving: boolean) {
    this.savingAddress = saving;
    this.ref.markForCheck();
  }

  onCancelAdd() {
    if (this.selectedAddress) {
      this.addingAddress = false;
    }
  }

  onAddAddress() {
    this.addingAddress = true;
  }

  onSelectAddress() {
    this.recalcCosts();
    this.changingAddress = false;
    this.ref.markForCheck();
  }

  changeAddress() {
    this.changingAddress = true;
  }

  onSavePayment(card: PaymentCard) {
    this.error = null;
    this.userService.addCard(card).subscribe(result => {
      this.user = this.userService.user$.getValue();
      this.selectedPayment = this.user.cards.find(a => a.primary);
      this.addingPayment = false;
      this.ref.markForCheck();
    }, err => {
      this.error = err.error.error.message;
      this.loadingPayment = false;
      this.ref.markForCheck();
    })
  }

  onSelectPayment() {
    this.changingPayment = false;
  }

  changePayment() {
    this.changingPayment = true;
  }

  onAddPayment() {
    this.addingPayment = true;
  }

  onLoadingPaymentForm(loading) {
    this.loadingPayment = loading;
  }

  onCancelAddPayment() {
    if (this.selectedPayment) {
      this.addingPayment = false;
    }
  }

  onReady(event: any) {

  }

  checkoutDisabled() {
    return !this.selectedAddress || !this.selectedPayment || this.changingPayment || this.changingAddress || this.checkingOut;
  }

  checkout() {
    this.checkingOut = true;
    this.orderService.postOrder(
      {
        address: this.selectedAddress,
        paymentId: this.selectedPayment.stripeId,
        rateId: this.shippingRateId,
        shipmentId: this.shipmentId,
        tax: this.tax
      }, this.product.id)
      .subscribe(order => {
        this.navigationService.navigate({ path: `/sales/orders/${order.id}` })
      }, err => {
        this.error = err.error.error.message;
      })
  }

  onGoToProduct() {
    this.navigationService.navigate({ path: `/products/detail/${this.product.id}` })
  }

}
