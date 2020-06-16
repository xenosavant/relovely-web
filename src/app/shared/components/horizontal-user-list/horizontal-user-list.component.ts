import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-horizontal-user-list',
  templateUrl: './horizontal-user-list.component.html',
  styleUrls: ['./horizontal-user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HorizontalUserListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
