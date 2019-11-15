import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { StatItem } from '@app/shared/models/stat-item.model';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileHeaderComponent implements OnInit {

  @Input() user: UserDetail;
  @Input() owner = false;
  public statItems: StatItem[];

  constructor() { }

  ngOnInit() {
    this.statItems = [];
    if (this.user.isSeller) {
      this.statItems.push({ name: 'Listings', count: this.user.numberListings });
      this.statItems.push({ name: 'Sales', count: this.user.numberSales });
      this.statItems.push({ name: 'Followers', count: this.user.numberFollowers });
      this.statItems.push({ name: 'Following', count: this.user.numberFollowing });
    } else {
      this.statItems.push({ name: '', count: -1 });
      this.statItems.push({ name: 'Favorites', count: this.user.numberSales });
      this.statItems.push({ name: 'Following', count: this.user.numberFollowing });
      this.statItems.push({ name: '', count: -1 });
    }
  }

}
