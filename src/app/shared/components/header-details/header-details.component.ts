import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  private _polygon: string;

  constructor(
    private sanitizer: DomSanitizer,
    private breakpointObserver: BreakpointObserver,
    private ref: ChangeDetectorRef,
    private navigationService: NavigationService) { }

  ngOnInit() {
    this.rating = (this.user.averageRating / 5) * 100;
    this._polygon = `polygon(0% 0%, ${this.rating}% 0%, ${this.rating}% 100%, 0% 100%)`;
    this.rating = 90;
    this.ratingDisplay = ((this.rating / 100) * 5).toFixed(1);
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.desktop = !result.matches;
      this.ref.markForCheck();
    })
  }

  ngOnChanges(changes) {

  }

  public get polygon() {
    return this._polygon ? this.sanitizer.bypassSecurityTrustStyle(this._polygon) : '';
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

  onGoToInstagram() {
    window.location.assign('https://www.instagram.com/' + this.user.instagramUsername);
  }

}
