import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { UserDetail } from '@app/shared/models/user-detail.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {

  @Input() user: UserDetail;

  constructor() { }

  ngOnInit() {
  }

}
