import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { UserDetail } from '@app/shared/models/user-detail.model';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent implements OnInit {

  @Input() users: UserDetail[];

  constructor() { }

  ngOnInit() {
  }

}
