import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Output, EventEmitter, ChangeDetectorRef, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { ElementOptions, ElementsOptions, StripeCardComponent, StripeService } from 'ngx-stripe';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PaymentCard } from '@app/shared/interfaces/payment-card';
import { REVERSE_CARD_TYPE_MAP } from '@app/shared/services/lookup/payment-card-map';
import { UserAuth } from '@app/shared/models/user-auth.model';
import { State } from '@app/shared/services/lookup/state';
import { LookupService } from '@app/shared/services/lookup/lookup.service';
import { Address } from '@app/shared/interfaces/address.interface';

@Component({
  selector: 'app-payment-card-input',
  templateUrl: './payment-card-input.component.html',
  styleUrls: ['./payment-card-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentCardInputComponent implements OnInit {

  @ViewChild(StripeCardComponent, { static: true }) cardElement: StripeCardComponent;

  @Input() buttonMargin: string;
  @Input() showCancel = true;
  @Input() verifyAddress = false;
  @Input() passThroughAddress = false;
  @Input() billingForm: FormGroup;
  @Output() ready: EventEmitter<boolean> = new EventEmitter();
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<PaymentCard> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();

  states: State[];
  error: string = null;
  loading = false;

  form: FormGroup;
  cardOptions: ElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        lineHeight: '40px',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#9a9a9a'
        },
      }
    }
  };
  elementsOptions: ElementsOptions = {
    locale: 'en'
  };

  constructor(
    private stripeService: StripeService,
    private ref: ChangeDetectorRef,
    private lookupService: LookupService) { }

  ngOnInit() {
    this.states = this.lookupService.states;
    this.form = new FormGroup({ name: new FormControl('', [Validators.required]) });
    if (this.verifyAddress) {
      this.form.addControl('line1', new FormControl('', [Validators.required]));
      this.form.addControl('line2', new FormControl(''));
      this.form.addControl('city', new FormControl('', [Validators.required]));
      this.form.addControl('state', new FormControl('', [Validators.required]));
      this.form.addControl('zip', new FormControl('', [Validators.required]));
    }
  }

  ngOnChanges() {
    this.ref.markForCheck();
  }

  onSave() {
    this.loading = true;
    this.isLoading.emit(true);
    let cardParams: any;
    if (this.verifyAddress) {
      if (this.passThroughAddress) {
        cardParams = {
          name: this.billingForm.get('name').value,
          address_line1: this.billingForm.get('line1').value,
          address_line2: this.billingForm.get('line2').value,
          address_city: this.billingForm.get('city').value,
          address_state: this.billingForm.get('state').value,
          address_zip: this.billingForm.get('zip').value,
          address_country: 'US'
        }
      } else {
        cardParams = {
          name: this.form.get('name').value,
          address_line1: this.form.get('line1').value,
          address_line2: this.form.get('line2').value,
          address_city: this.form.get('city').value,
          address_state: this.form.get('state').value,
          address_zip: this.form.get('zip').value,
          address_country: 'US'
        }
      }
    } else {
      cardParams = {
        name: this.form.get('name').value
      };
    }
    this.stripeService
      .createToken(this.cardElement.getCard(), cardParams)
      .subscribe(result => {
        if (result.token) {
          this.save.emit({
            last4: result.token.card.last4,
            name: this.form.get('name').value,
            type: result.token.card.brand,
            stripeId: result.token.id,
            expirationMonth: result.token.card.exp_month,
            expirationYear: result.token.card.exp_year,
          });
        } else {
          if (result.error) {
            this.error = (result.error as any).message;
          } else {
            this.error = 'Please correct card information'
          }
          this.loading = false;
          this.isLoading.emit(false);
          this.ref.markForCheck();
        }
      }, err => {
        this.isLoading.emit(false);
        this.loading = false;
        this.ref.markForCheck();
      })
  }

  onCardChanged(event: any) {
    if (event.type === 'ready') {
      this.ready.emit(true);
      this.loading = false;
      this.ref.markForCheck()
    }
  }

  onClose() {
    this.close.emit();
  }

  formValid() {
    return this.passThroughAddress ? this.billingForm.valid : this.form.valid;
  }

}
