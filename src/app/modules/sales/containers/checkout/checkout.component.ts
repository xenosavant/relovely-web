import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@app/shared/services/product/product.service';
import { Product } from '@app/shared/models/product.model';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Address } from '@app/shared/interfaces/address.interface';
import { UserService } from '@app/shared/services/user/user.service';
import { LookupService } from '@app/shared/services/lookup/lookup.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  addresses: Address[];
  selectedAddress: Address;
  loading = true;
  addingAddress = false;
  changingAddress = false;
  states;
  form: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private userService: UserService,
    private lookupService: LookupService,
    private breakpointObserver: BreakpointObserver,
    private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.addresses = this.userService.currentUser.addresses;
    this.states = this.lookupService.states;
    if (this.addresses.length) {
      this.selectedAddress = this.addresses.find(a => a.primary);
    } else {
      this.addingAddress = true;
    }

    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.mobile = result.matches;
    })
    this.activatedRoute.params.subscribe(params => {
      this.productService.getProduct(params['id']).subscribe(product => {
        this.product = product;
        this.total = this.product.price + this.tax + this.shippingCost;
        this.loading = false;
        this.ref.markForCheck();
      })
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
    this.userService.updateUser(this.userService.currentUser.id, { addresses: [...this.addresses, saveAddress] }).subscribe(user => {
      this.userService.setCurrentUser(user);
      this.addresses = this.userService.currentUser.addresses;
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

}
