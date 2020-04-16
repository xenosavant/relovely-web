import { Component, OnInit, ChangeDetectionStrategy, Input, SimpleChanges, ChangeDetectorRef, Output } from '@angular/core';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { StatItem } from '@app/shared/models/stat-item.model';
import { BreakpointObserver } from '@angular/cdk/layout';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileHeaderComponent implements OnInit {

  @Input() user: UserDetail;
  @Input() owner = false;
  @Output() update: EventEmitter<boolean> = new EventEmitter<boolean>();
  public statItems: StatItem[];
  public desktop: boolean;


  constructor(private ref: ChangeDetectorRef, private breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
    this.statItems = [];
    if (this.user.type === 'seller') {
      this.statItems.push({ name: 'Listings', count: this.user.listings.length });
      this.statItems.push({ name: 'Sales', count: this.user.sales.length });
      this.statItems.push({ name: 'Followers', count: this.user.followers.length });
      this.statItems.push({ name: 'Following', count: this.user.following.length });
    } else {
      this.statItems.push({ name: '', count: -1 });
      this.statItems.push({ name: 'Favorites', count: this.user.favorites.length });
      this.statItems.push({ name: 'Following', count: this.user.following.length });
      this.statItems.push({ name: '', count: -1 });
    }
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.desktop = !result.matches;
      this.ref.markForCheck();
    })
  }

  onUpdate() {
    if (this.owner) {
      this.update.emit(true);
    }
  }

}
