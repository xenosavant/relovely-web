import { Component, OnInit, ChangeDetectionStrategy, Input, NgZone, ChangeDetectorRef } from '@angular/core';
import { Product } from '@app/shared/models/product.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { products } from '@app/data/products.data';
import { NavigationService } from '@app/shared/services/navigation.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { OwlCarouselOConfig } from 'ngx-owl-carousel-o/lib/carousel/owl-carousel-o-config';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent implements OnInit {

  product: Product;
  mobile: boolean;
  currentImage: string;
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

  constructor(private breakpointObserver: BreakpointObserver, private route: ActivatedRoute, private navigationService: NavigationService,
    private zone: NgZone, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id: string = params.get('id');
      this.product = products.find(item => {
        return item.id === id;
      });
      this.zone.run(() => {
        this.ref.markForCheck();
      });
      this.product.images = [{ cropped: this.product.asset, original: this.product.asset }, { cropped: this.product.asset, original: this.product.asset }, { cropped: this.product.asset, original: this.product.asset }];
      this.currentImage = this.product.images[0].cropped;
    });
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.mobile = result.matches;
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
        this.zone.run(() => {
          this.ref.markForCheck();
        });
      }
    });
  }

  goToProduct(id) {
    this.navigationService.navigate({ path: '/products/detail/' + id });
  }

  goToProfile($event: any) {
    this.navigationService.navigate({ path: '/member/' + this.product.seller.id });
  }

  carouselTranslated(event: any) {
    console.log(event);
  }
}
