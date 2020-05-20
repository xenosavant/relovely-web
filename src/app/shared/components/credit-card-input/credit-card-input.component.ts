import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Output, EventEmitter } from '@angular/core';
import { ElementOptions, ElementsOptions, StripeCardComponent, StripeService } from 'ngx-stripe';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreditCard } from '@app/shared/interfaces/payment-card';
import { REVERSE_CARD_TYPE_MAP } from '@app/shared/services/lookup/credit-card-map';

@Component({
  selector: 'app-credit-card-input',
  templateUrl: './credit-card-input.component.html',
  styleUrls: ['./credit-card-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditCardInputComponent implements OnInit {

  @ViewChild(StripeCardComponent, { static: true }) cardElement: StripeCardComponent;

  @Output() ready: EventEmitter<boolean> = new EventEmitter();
  @Output() card: EventEmitter<CreditCard> = new EventEmitter();

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

  constructor(private fb: FormBuilder, private stripeService: StripeService) { }

  ngOnInit() {
    this.form = this.fb.group({ name: ['', [Validators.required]] });
  }

  onSubmit() {
    this.stripeService
      .createToken(this.cardElement.getCard(), { name: 'Domenick Packett' })
      .subscribe(result => {
        this.card.emit({
          last4: result.token.card.last4,
          name: this.form.get('name').value,
          type: REVERSE_CARD_TYPE_MAP[result.token.card.brand],
          stripeId: result.token.card.id,
          expirationMonth: result.token.card.exp_month,
          expirationYear: result.token.card.exp_year,
        });
      }, err => console.log(err))
  }

  onCardChanged(event: any) {
    if (event.type === 'ready') {
      this.ready.emit(true);
    }
  }

}
