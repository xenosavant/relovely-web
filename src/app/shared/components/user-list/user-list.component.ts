import { Component, OnInit, ChangeDetectionStrategy, Input, SimpleChange } from '@angular/core';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { NavigationService } from '@app/shared/services/navigation.service';
import { NavigationItem } from '@app/shared/models/navigation-item.model';
import { UserList } from '@app/shared/models/user-list.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {

  @Input() user: UserList;

  constructor(private navigationService: NavigationService) { }

  ngOnInit() {
  }

  goToProfile() {
    this.navigationService.navigate({ path: `/member/${this.user.id}` });
  }

}
