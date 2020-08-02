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
import { MatCheckboxChange } from '@angular/material';

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
  shippingCost: number;
  mobile = false;
  user: UserAuth;
  selectedAddress: Address;
  billingAddress: Address;
  selectedPayment: PaymentCard;
  loading = true;
  addingAddress = false;
  addingPayment = false;
  changingPayment = false;
  changingAddress = false;
  states;
  loadingPayment: boolean;
  checkingOut = false;
  shippingCostLoading = true;
  shippingRateId: string;
  shipmentId: string;
  savingAddress = false;
  error: string;
  shippingAddress: FormGroup;
  email: FormGroup;
  billingSame = false;
  addressError = false;
  overrideAddress = false;
  verifyAddress = false;
  emailList = true;
  createUser = true;

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
    this.states = this.lookupService.states;
    if (this.user) {
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
    } else {
      this.shippingAddress = new FormGroup({
        name: new FormControl('', [Validators.required]),
        line1: new FormControl('', [Validators.required]),
        line2: new FormControl(''),
        city: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        zip: new FormControl('', [Validators.required, Validators.maxLength(5)]),
      });
      this.email = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
      })
    }
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.mobile = result.matches;
    })
    this.activatedRoute.params.subscribe(params => {
      this.productService.getProduct(params['id']).subscribe(product => {
        this.product = product.product;
        if (this.user) {
          this.selectedAddress = this.user.addresses.find(a => a.primary);
        }
        this.recalcCosts();
      }, err => {
        this.error = 'Hmmm...something went wrong. Please referesh the page and try again.'
        this.ref.markForCheck();
      });
    })
  }

  recalcCosts() {
    this.shippingCostLoading = true;
    this.ref.markForCheck();
    this.error = null;
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
    this.shippingCostLoading = true;
    this.user.addresses.forEach(address => {
      if (address.id !== this.selectedAddress.id) {
        delete address.primary;
      } else {
        address.primary = true;
      }
    })
    const update = [...this.user.addresses];
    this.userService.updateUser(this.user.id, { addresses: update }).subscribe(result => {
      this.recalcCosts();
      this.changingAddress = false;
      this.ref.markForCheck();
    }, error => {
      this.changingAddress = false;
      this.shippingCostLoading = false;
    })
  }

  onCheckAddress() {
    if (this.shippingAddress.valid) {
      const address = this.shippingAddressValue;
      if (!this.overrideAddress) {
        this.shipmentService.verifyAddress(address).subscribe(val => {
          if (val.success) {
            this.addressError = false;
            if (val.verify) {
              this.overrideAddress = true;
              this.verifyAddress = true;
              this.shippingAddress.get('line1').setValue(val.correctedAddress.line1);
              this.shippingAddress.get('line2').setValue(val.correctedAddress.line2);
              this.shippingAddress.get('city').setValue(val.correctedAddress.city);
              this.shippingAddress.get('state').setValue(val.correctedAddress.state);
              this.shippingAddress.get('zip').setValue(val.correctedAddress.zip);
              this.selectedAddress = this.shippingAddressValue;
              this.recalcCosts();
              this.ref.markForCheck();
            } else {
              this.selectedAddress = this.shippingAddressValue;
              this.recalcCosts();
            }
          } else {
            this.addressError = true;
            this.overrideAddress = false;
            this.ref.markForCheck();
          }
        });
      } else {
        this.addressError = false;
        this.verifyAddress = false;
        this.selectedAddress = this.shippingAddressValue;
        this.recalcCosts();
      }
    }
  }

  changeAddress() {
    this.changingAddress = true;
  }


  onSavePayment(card: PaymentCard) {
    this.error = null;
    if (this.user) {
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
    else {
      this.selectedPayment = card;
      this.loadingPayment = false;
    }
  }

  onSelectPayment() {
    this.changingPayment = false;
  }

  changePayment() {
    this.changingPayment = true;
  }

  onAddPayment() {
    this.loadingPayment = true;
    this.addingPayment = true;
  }

  onLoadingPaymentForm(loading) {
    this.loadingPayment = loading;
  }

  primaryAddressChanged() {
    const updates = [];
    this.user.addresses.forEach(address => {
      if (address.id === this.selectedAddress.id) {
        address.primary = true;
      } else if (address.primary) {
        delete address.primary;
      }
      updates.push(address);
    });
    this.userService.updateUser(this.user.id, { addresses: updates }).subscribe(result => {
      console.log(result);
    });
  }

  primaryPaymentChanged() {
    console.log('priuar')
    const updates = [];
    this.user.cards.forEach(card => {
      if (card.stripeId === this.selectedPayment.stripeId) {
        card.primary = true;
      } else if (card.primary) {
        delete card.primary;
      }
      updates.push(card);
    });
    return this.userService.updateUser(this.user.id, { cards: updates }).subscribe(result => {

    });
  }

  onCancelAddPayment() {
    if (this.selectedPayment) {
      this.addingPayment = false;
    }
  }

  onReady(event: any) {
    this.loadingPayment = false;
  }

  billingStateChanged(value: MatCheckboxChange) {
    if (value) {
      this.billingSame = value.checked;
    }
  }

  checkoutDisabled() {
    if (this.user) {
      return !this.selectedAddress || !this.selectedPayment || this.changingPayment || this.changingAddress || this.checkingOut;
    } else {
      return !this.selectedPayment || !this.shippingAddress.valid || !this.email.valid || this.addressError;
    }
  }

  checkout() {
    this.checkingOut = true;
    this.error = null;
    if (this.user) {
      this.orderService.postOrder(
        {
          address: this.selectedAddress,
          paymentId: this.selectedPayment.stripeId,
          shipmentId: this.shipmentId,
          tax: this.tax
        }, this.product.id)
        .subscribe(order => {
          this.navigationService.navigate({ path: `/sales/orders/${order.id}` })
        }, err => {
          this.error = err.error.error.message;
          this.checkingOut = false;
          this.ref.markForCheck();
        })
    } else {
      this.orderService.guestOrder(
        {
          address: this.shippingAddressValue,
          paymentId: this.selectedPayment.stripeId,
          shipmentId: this.shipmentId,
          tax: this.tax,
          last4: this.selectedPayment.last4,
          cardType: this.selectedPayment.type,
          email: this.email.get('email').value,
          joinMailingList: this.emailList,
          createAccount: this.createUser
        }, this.product.id)
        .subscribe(order => {
          this.navigationService.navigate({ path: `/sales/orders/guest` })
        }, err => {
          this.error = err.error.error.message;
          this.checkingOut = false;
          this.ref.markForCheck();
        })
    }
  }

  onGoToProduct() {
    this.navigationService.navigate({ path: `/products/detail/${this.product.id}` })
  }

  get shippingAddressValue(): Address {
    return {
      name: this.shippingAddress.get('name').value,
      line1: this.shippingAddress.get('line1').value,
      line2: this.shippingAddress.get('line2').value,
      city: this.shippingAddress.get('city').value,
      state: this.shippingAddress.get('state').value,
      zip: this.shippingAddress.get('zip').value,
      country: 'US'
    }
  }

}
