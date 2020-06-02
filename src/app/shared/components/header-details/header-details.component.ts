import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { BreakpointObserver } from '@angular/cdk/layout';

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

  constructor(
    private breakpointObserver: BreakpointObserver,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.desktop = !result.matches;
      this.ref.markForCheck();
    })
  }

  ngOnChanges(changes) {
    console.log(changes);
  }

  onAction(action: string) {
    console.log(action);
    this.action.emit(action);
  }

  onUdpate() {
    this.update.emit();
  }

}
