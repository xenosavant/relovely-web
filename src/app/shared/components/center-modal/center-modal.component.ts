import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-center-modal',
  templateUrl: './center-modal.component.html',
  styleUrls: ['./center-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CenterModalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
