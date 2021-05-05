import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, Output, EventEmitter, ChangeDetectorRef, SimpleChange, SimpleChanges, OnChanges } from '@angular/core';
import { UserService } from '@app/shared/services/user/user.service';
import { UserList } from '@app/shared/models/user-list.model';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-sellers',
  templateUrl: './sellers.component.html',
  styleUrls: ['./sellers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SellersComponent implements OnInit {

  sellers: UserList[];
  mobile: boolean;

  constructor(private userService: UserService,
    private ref: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    private navigationService: NavigationService) {
    this.navigationService.setHeader('Shop By Influencer')
  }

  ngOnInit(): void {
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.mobile = result.matches;
    })
    this.userService.getSellers().subscribe(sellers => {
      this.sellers = sellers;
      this.ref.markForCheck();
    });
  }
}
