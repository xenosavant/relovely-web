import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddAddressComponent implements OnInit {

  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onClose(event) {
    this.close.emit(event);
  }

}
