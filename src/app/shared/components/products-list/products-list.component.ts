import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '@app/shared/models/product.model';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { UserDetail } from '@app/shared/models/user-detail.model';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListComponent implements OnInit {

  @Input() products: Product[];
  @Input() showGrid?: boolean;
  @Input() showHeader = true;
  @Input() showCreate = false;
  @Input() user: UserDetail;

  @Output() create: EventEmitter<any> = new EventEmitter;
  @Output() close: EventEmitter<any> = new EventEmitter;
  @Output() edit: EventEmitter<Product> = new EventEmitter<Product>();

  hoverIndex = -1;

  constructor(private navigationService: NavigationService) { }

  ngOnInit() {

  }

  onEnter(index) {
    this.hoverIndex = index;
  }

  onLeave() {
    this.hoverIndex = -1;
  }

  onCreate($event: any) {
    this.create.emit($event);
  }

  onEdit(product: Product) {
    this.edit.emit(product);
  }

}
