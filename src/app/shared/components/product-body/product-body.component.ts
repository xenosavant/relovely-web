import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '@app/shared/models/product.model';
import { getShippingCost } from '@app/shared/utils/shipping';

@Component({
  selector: 'app-product-body',
  templateUrl: './product-body.component.html',
  styleUrls: ['./product-body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductBodyComponent implements OnInit {

  @Input() product: Product;
  @Output() clicked: EventEmitter<string> = new EventEmitter;

  constructor() { }

  ngOnInit() {
  }

  onClicked($event) {
    this.clicked.emit(this.product.id);
  }

  get price() {
    return this.product.price + getShippingCost(this.product.weight);
  }

}
