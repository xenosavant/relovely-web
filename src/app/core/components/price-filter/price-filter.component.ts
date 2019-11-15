import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-price-filter',
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceFilterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
