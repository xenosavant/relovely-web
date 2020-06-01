import { Component, OnInit, ChangeDetectionStrategy, Input, SimpleChanges, ChangeDetectorRef, Output, OnChanges } from '@angular/core';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { StatItem } from '@app/shared/models/stat-item.model';
import { BreakpointObserver } from '@angular/cdk/layout';
import { EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileHeaderComponent implements OnChanges {

  @Input() user: UserDetail;
  @Input() owner = false;
  @Input() editing = false;
  @Input() disableSave: boolean;
  @Input() following: boolean;
  @Output() update: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() action: EventEmitter<string> = new EventEmitter<string>();
  public statItems: StatItem[];
  public desktop: boolean;
  public rating: number;
  public ratingDisplay: string;


  constructor(private ref: ChangeDetectorRef, private breakpointObserver: BreakpointObserver) { }

  ngOnChanges() {
    this.statItems = [];

    this.rating = (this.user.averageRating / 5) * 100;
    this.ratingDisplay = ((this.rating / 100) * 5).toFixed(1);
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

  onAction(type: string) {
    console.log(type);
    this.action.emit(type);
  }

}
