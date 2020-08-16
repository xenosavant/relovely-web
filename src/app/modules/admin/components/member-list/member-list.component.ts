import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
