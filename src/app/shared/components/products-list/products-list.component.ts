import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges } from '@angular/core';
import { Product } from '@app/shared/models/product.model';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { ProductService } from '@app/shared/services/product/product.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListComponent implements OnChanges {

  @Input() products: Product[];
  @Input() showGrid?: boolean;
  @Input() showHeader = true;
  @Input() showCreate = false;
  @Input() user: UserDetail;

  @Output() create: EventEmitter<any> = new EventEmitter;
  @Output() close: EventEmitter<any> = new EventEmitter;
  @Output() edit: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() delete: EventEmitter<string> = new EventEmitter<string>();
  @Output() unfavorite: EventEmitter<string> = new EventEmitter<string>();

  hoverIndex = -1;

  constructor(private navigationService: NavigationService,
    private productService: ProductService,
    private ref: ChangeDetectorRef) { }

  ngOnChanges() {
    this.ref.markForCheck();
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

  onDelete(product: Product) {
    this.delete.emit(product.id);
  }

  onUnfavorite(id: string) {
    this.unfavorite.emit(id);
  }

}
