import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCreateComponent implements OnInit {

  @Output() close: EventEmitter<any> = new EventEmitter;

  constructor() { }

  ngOnInit() {
  }

  onClose($event: any) {
    this.close.emit($event);
  }

}
