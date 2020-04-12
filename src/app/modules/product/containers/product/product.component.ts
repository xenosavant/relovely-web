import { Component, OnInit, ChangeDetectionStrategy, Input, NgZone, ChangeDetectorRef } from '@angular/core';
import { Product } from '@app/shared/models/product.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { products } from '@app/data/products.data';
import { NavigationService } from '@app/shared/services/navigation.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { OwlCarouselOConfig } from 'ngx-owl-carousel-o/lib/carousel/owl-carousel-o-config';
import { ProductService } from '@app/shared/services/product/product.service';
import { ImageSet } from '@app/shared/interfaces/image-set.interface';
import { VideoMetaData } from '@app/shared/interfaces/video-meta-data';
import { OrderService } from '@app/shared/services/order/order.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent implements OnInit {

  product: Product;
  mobile: boolean;
  loading = true;
  videoThumbnail: string;
  videoPadding = 0;
  currentItem: string | VideoMetaData;
  id: string;
  public carouselOptions: Partial<OwlCarouselOConfig> = {
    dots: true,
    autoplay: false,
    items: 3,
    responsive: {
      0: { items: 1 }
    }
  };

  public thumbnailsCarouselOptions: Partial<OwlCarouselOConfig> = {
    dots: false,
    autoplay: false,
    margin: 10,
    items: 3,
    responsive: {
      800: { items: 4 },
      900: { items: 5 },
    }
  };

  constructor(private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private zone: NgZone,
    private ref: ChangeDetectorRef,
    private productService: ProductService,
    private orderService: OrderService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');

      this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
        this.mobile = result.matches;
        if (!this.product) {
          this.productService.getProduct(this.id).subscribe(response => {
            this.product = response;
            this.currentItem = this.product.videos[0] ? this.product.videos[0] : this.product.images[0].cropped;
            if (this.product.videos[0]) {
              this.videoThumbnail = this.product.videos[0].url.replace(this.product.videos[0].format, 'jpg');
              const aspect = this.product.videos[0].height / this.product.videos[0].width;
              if (aspect < 1) {
                this.videoPadding = Math.round(((1 - aspect) * 100) / 2);
              }
            }
            if (!this.mobile) {
              this.carouselOptions = {
                dots: false,
                autoplay: false,
                responsive: {
                  800: { items: 4 },
                  900: { items: 5 }
                }
              };
            } else {
              this.carouselOptions = {
                dots: true,
                autoplay: false,
                responsive: {
                  0: { items: 1 }
                }
              };
            }
            this.loading = false;
            this.zone.run(() => {
              this.ref.markForCheck();
            });
          })
        }
      });
    });
  }

  goToProduct(id) {
    this.navigationService.navigate({ path: '/products/detail/' + id });
  }

  goToProfile($event: any) {
    this.navigationService.navigate({ path: '/member/' + this.product.seller.id });
  }

  carouselTranslated(event: any) {

  }

  setActiveItem(item: VideoMetaData | string) {
    this.currentItem = item;
  }

  purchase(event: any) {
    this.orderService.postOrder({
      address: {
        line1: '298 6th St',
        line2: 'Apt 1',
        city: 'Jersey City',
        state: 'NJ',
        zip: '07302',
        country: 'US'
      }
    }, this.product.id).subscribe(response => {

    })
  }
}
