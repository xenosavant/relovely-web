import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { NavigationService } from '@app/shared/services/navigation.service';
import { NavigationItem } from '@app/shared/models/navigation-item.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {

  @Input() user: UserDetail;

  constructor(private navigationService: NavigationService) { }

  ngOnInit() {
  }

  goToProfile() {
    this.navigationService.navigate(new NavigationItem([], `/member/${this.user.id}`, '', 0, [], [], null), false);
  }

}
