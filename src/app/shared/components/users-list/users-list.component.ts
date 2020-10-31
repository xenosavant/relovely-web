import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef, SimpleChange } from '@angular/core';
import { UserService } from '@app/shared/services/user/user.service';
import { UserList } from '@app/shared/models/user-list.model';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent {

  @Input() users: UserList[];

  constructor(private userService: UserService, private ref: ChangeDetectorRef) { }

  ngOnChanges(changes) {
    console.log(changes)
  }

}
