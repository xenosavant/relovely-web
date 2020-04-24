import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '@app/shared/models/product.model';
import { NavigationService } from '@app/shared/services/navigation.service';

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
  @Input() userId: string;

  @Output() create: EventEmitter<any> = new EventEmitter;

  hoverIndex = -1;

  constructor(private navigationService: NavigationService) { }

  ngOnInit() {
    // set showCreate here if current user is seller
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

}
