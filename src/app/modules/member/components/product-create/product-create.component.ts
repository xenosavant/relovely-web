import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCreateComponent implements OnInit {

  @Output() close: EventEmitter<any> = new EventEmitter;

  public imageChangedEvent: any = null;
  public crop = false;

  constructor() { }

  ngOnInit() {
  }

  public imageChanged($event: any): void {
    this.imageChangedEvent = $event;
    this.crop = true;
  }

  onClose($event: any) {
    this.close.emit($event);
  }

}
