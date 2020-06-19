import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';

@Component({
  selector: 'app-header-details',
  templateUrl: './header-details.component.html',
  styleUrls: ['./header-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderDetailsComponent implements OnInit {

  @Input() user: UserDetail;
  @Input() owner: boolean;
  @Input() editing: boolean;
  @Input() disableSave: boolean;
  @Input() following: boolean;

  @Output() action: EventEmitter<string> = new EventEmitter();
  @Output() update: EventEmitter<any> = new EventEmitter();

  desktop: boolean;
  public rating: number;
  public ratingDisplay: string;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private ref: ChangeDetectorRef,
    private navigationService: NavigationService) { }

  ngOnInit() {
    this.rating = (this.user.averageRating / 5) * 100;
    this.ratingDisplay = ((this.rating / 100) * 5).toFixed(1);
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.desktop = !result.matches;
      this.ref.markForCheck();
    })
  }

  ngOnChanges(changes) {

  }

  onAction(action: string) {
    this.action.emit(action);
  }

  onUpdate() {
    this.update.emit();
  }

  goToRatings() {
    this.navigationService.navigate({ path: `/member/ratings/${this.user.id}` })
  }

}
