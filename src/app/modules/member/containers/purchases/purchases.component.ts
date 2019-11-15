import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PurchasesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
