import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { UserService } from '@app/shared/services/user/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent implements OnInit {

  @Input() users: UserDetail[];

  constructor(private userService: UserService, private ref: ChangeDetectorRef) { }

  ngOnInit() {
  }

}
