import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '@app/shared/models/product.model';

@Component({
  selector: 'app-horizontal-product-list',
  templateUrl: './horizontal-product-list.component.html',
  styleUrls: ['./horizontal-product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HorizontalProductListComponent implements OnInit {

  @Input() products: Product[];
  @Input() title: string;
  @Input() subtitle: string;

  @Output() clicked: EventEmitter<string> = new EventEmitter;

  constructor() { }

  ngOnInit() {
  }

  onClicked(id) {
    this.clicked.emit(id);
  }

}
