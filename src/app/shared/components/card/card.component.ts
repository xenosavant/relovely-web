import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Card } from '@app/shared/interfaces/card.interface';
import { CARD_TYPE_MAP } from '@app/shared/services/lookup/payment-card-map';
import { PaymentCard } from '@app/shared/interfaces/payment-card';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements OnInit {

  @Input()
  card: PaymentCard;
  map = CARD_TYPE_MAP;

  constructor() { }

  ngOnInit() {
  }

}
