import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@app/shared/services/product/product.service';
import { UserService } from '@app/shared/services/user/user.service';
import { OrderService } from '@app/shared/services/order/order.service';
import { LookupService } from '@app/shared/services/lookup/lookup.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ShipmentService } from '@app/shared/services/shipment/shipment.service';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { Product } from '@app/shared/models/product.model';
import { Order } from '@app/shared/models/order.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Review } from '@app/shared/models/review.model';
import { ReviewService } from '@app/shared/services/review/review.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewComponent implements OnInit {


  order: Order;
  loading = true;
  mobile: boolean;
  rating: number = 0;
  form: FormGroup = new FormGroup({
    body: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
  })
  saving = false;
  readonly: boolean;
  title: string;

  constructor(private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private userService: UserService,
    private lookupService: LookupService,
    private breakpointObserver: BreakpointObserver,
    private reviewService: ReviewService,
    private navigationService: NavigationService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    if (!this.userService.user$.value) {
      this.navigationService.navigate({ 'path': '/' })
    }
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.mobile = result.matches;
    })
    this.activatedRoute.params.subscribe(params => {
      this.orderService.getOrder(params['id']).subscribe(order => {
        this.order = order;
        if (this.order.review) {
          this.readonly = true;
          this.title = 'Product Review'
        } else {
          this.title = 'Write a Review'
        }
        this.loading = false;
        this.ref.markForCheck();
      });
    });
  }

  onSubmit() {
    this.saving = true;
    this.reviewService.postReview({
      rating: this.rating,
      title: this.form.get('title').value,
      body: this.form.get('body').value
    }, this.order.product.id).subscribe(response => {
      this.saving = false;
      this.readonly = true;
      this.order = response;
      this.title = 'Product Review'
      this.ref.markForCheck();
    });
  }

  onImageClick() {
    this.navigationService.navigate({ path: `/products/detail/${this.order.product.id}` })
  }

  goToProfile(id: string) {
    this.navigationService.navigate({ path: `/member/${this.order.seller.id}` });
  }

}