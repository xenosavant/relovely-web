import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressComponent implements OnInit {

  @Input() address;
  @Input() name;

  constructor() { }

  ngOnInit() {
  }

}
