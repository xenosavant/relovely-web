import { Component, OnInit, ChangeDetectionStrategy, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { StatItem } from '@app/shared/models/stat-item.model';
import { BreakpointObserver } from '@angular/cdk/layout';

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
  public desktop: boolean;

  constructor(private ref: ChangeDetectorRef, private breakpointObserver: BreakpointObserver) { }

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
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.desktop = !result.matches;
      this.ref.markForCheck();
    })
  }

}
