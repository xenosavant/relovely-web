import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { UserAuth } from '@app/shared/models/user-auth.model';
import { PaymentCard } from '@app/shared/interfaces/payment-card';

@Component({
  selector: 'app-add-payment-card',
  templateUrl: './add-payment-card.component.html',
  styleUrls: ['./add-payment-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPaymentCardComponent implements OnInit {

  loading = false;

  @Output() save: EventEmitter<PaymentCard> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {

  }

  onCardCreated(card: PaymentCard) {
    this.save.emit(card);
  }

  onClose() {
    this.close.emit();
  }

  onLoading(loading: boolean) {
    this.loading = loading;
  }


}
