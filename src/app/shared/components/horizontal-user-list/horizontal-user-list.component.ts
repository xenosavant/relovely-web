import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { UserList } from '@app/shared/models/user-list.model';

@Component({
  selector: 'app-horizontal-user-list',
  templateUrl: './horizontal-user-list.component.html',
  styleUrls: ['./horizontal-user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HorizontalUserListComponent implements OnInit {

  @Input() users: UserList[];

  constructor() { }

  ngOnInit() {
  }

}
