import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '@app/shared/services/order/order.service';
import { UserService } from '@app/shared/services/user/user.service';
import { LookupService } from '@app/shared/services/lookup/lookup.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ReviewService } from '@app/shared/services/review/review.service';
import { NavigationService } from '@app/shared/services/navigation.service';
import { Review } from '@app/shared/models/review.model';
import { UserReviewsResponse, ReviewResponse } from '@app/shared/services/user/user-reviews.response';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewsComponent implements OnInit {

  title: string;
  loading = true;
  reviews: ReviewResponse[];
  name: string;
  id: string;
  mobile: boolean;

  constructor(private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private userService: UserService,
    private lookupService: LookupService,
    private breakpointObserver: BreakpointObserver,
    private reviewService: ReviewService,
    private navigationService: NavigationService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.mobile = result.matches;
    });
    this.activatedRoute.params.subscribe(map => {
      if (this.id = map['id']) {
        this.userService.getReviews(this.id).subscribe(response => {
          this.reviews = response.reviews;
          this.name = this.userService.currentUser.id === this.id ? 'My' : response.name + `'s`;
          this.loading = false;
          this.ref.markForCheck();
        })
      }
    })
  }

  goToProduct(id: string) {
    this.navigationService.navigate({ path: `/products/detail/${id}` });
  }

  goToProfile(id: string) {
    this.navigationService.navigate({ path: `/member/${id}` });
  }

}
