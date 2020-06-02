import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '@app/shared/services/order/order.service';
import { UserService } from '@app/shared/services/user/user.service';
import { LookupService } from '@app/shared/services/lookup/lookup.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ReviewService } from '@app/shared/services/review/review.service';
import { NavigationService } from '@app/shared/services/navigation.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewsComponent implements OnInit {

  title: string;
  loading = true;

  constructor(private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private userService: UserService,
    private lookupService: LookupService,
    private breakpointObserver: BreakpointObserver,
    private reviewService: ReviewService,
    private navigationService: NavigationService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {

  }

}
