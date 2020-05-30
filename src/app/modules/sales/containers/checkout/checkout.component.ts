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
import { NavigationService } from '@app/shared/services/navigation.service';

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
  form: FormGroup;
  loadingPayment: boolean;
  checkingOut = false;
  shippingCostLoading = true;
  shippingRateId: string;
  shipmentId: string;

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
    this.user = this.userService.currentUser;
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
        this.product = product;
        const toAddress = this.user.addresses.find(a => a.primary);
        if (toAddress) {
          this.shipmentService.previewShipment({ weight: 32, toAddress: toAddress, sellerId: product.sellerId, price: product.price }).subscribe(response => {
            this.shippingCost = response.shippingRate;
            this.total = this.product.price + this.shippingCost;
            this.shippingRateId = response.rateId;
            this.shipmentId = response.shipmentId;
            this.tax = response.taxRate;
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
      });
    })
  }

  onSaveAddress() {
    const saveAddress: Address = {
      name: this.form.get('name').value,
      line1: this.form.get('line1').value,
      line2: this.form.get('line2').value,
      city: this.form.get('city').value,
      state: this.form.get('state').value,
      zip: this.form.get('zip').value,
      country: 'US'
    }
    this.userService.updateUser(this.userService.currentUser.id, { addresses: [...this.user.addresses, saveAddress] }).subscribe(user => {
      this.user = user;
      this.selectedAddress = saveAddress;
      this.addingAddress = false;
    })
  }
  onCancelAdd($event: any) {
    this.addingAddress = false;
  }

  onAddAddress() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      line1: new FormControl('', [Validators.required]),
      line2: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      zip: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    });
    this.addingAddress = true;
  }

  changeAddress() {
    this.changingAddress = true;
  }

  onSavePayment(card: PaymentCard) {

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
    this.addingPayment = false;
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
        shipmentId: this.shipmentId
      }, this.product.id)
      .subscribe(order => {
        this.navigationService.navigate({ path: `/sales/orders/${order.id}` })
      }, err => {
        console.log(err);
      })
  }

}
