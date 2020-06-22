import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Output, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';
import { ElementOptions, ElementsOptions, StripeCardComponent, StripeService } from 'ngx-stripe';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaymentCard } from '@app/shared/interfaces/payment-card';
import { REVERSE_CARD_TYPE_MAP } from '@app/shared/services/lookup/payment-card-map';
import { UserAuth } from '@app/shared/models/user-auth.model';

@Component({
  selector: 'app-payment-card-input',
  templateUrl: './payment-card-input.component.html',
  styleUrls: ['./payment-card-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentCardInputComponent implements OnInit {

  @ViewChild(StripeCardComponent, { static: true }) cardElement: StripeCardComponent;

  @Input() buttonMargin: string;
  @Output() ready: EventEmitter<boolean> = new EventEmitter();
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<PaymentCard> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();

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
          color: '#CFD7E0'
        },
      }
    }
  };
  elementsOptions: ElementsOptions = {
    locale: 'en'
  };

  constructor(private fb: FormBuilder,
    private stripeService: StripeService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.form = this.fb.group({ name: ['', [Validators.required]] });
  }

  onSave() {
    this.loading = true;
    this.isLoading.emit(true);
    this.stripeService
      .createToken(this.cardElement.getCard(), { name: this.form.get('name').value })
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

}
