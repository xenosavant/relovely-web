import { Component, OnInit, ChangeDetectionStrategy, Input, NgZone, ChangeDetectorRef, ViewChild, OnChanges } from '@angular/core';
import { Product } from '@app/shared/models/product.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { OwlCarouselOConfig } from 'ngx-owl-carousel-o/lib/carousel/owl-carousel-o-config';
import { ProductService } from '@app/shared/services/product/product.service';
import { ImageSet } from '@app/shared/interfaces/image-set.interface';
import { VideoMetaData } from '@app/shared/interfaces/video-meta-data';
import { UserService } from '@app/shared/services/user/user.service';
import { TemplatePortal } from '@angular/cdk/portal';
import { OverlayService } from '@app/shared/services/overlay.service';
import { UserAuth } from '@app/shared/models/user-auth.model';
import { NavigationItem } from '@app/shared/models/navigation-item.model';
import { LookupService } from '@app/shared/services/lookup/lookup.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent implements OnInit {

  @ViewChild('viewImage', { static: true }) viewImageElement: TemplatePortal<any>;
  @ViewChild('productCreateModal', { static: true }) productCreateModal: TemplatePortal<any>;

  product: Product;
  mobile: boolean;
  currentUser: UserAuth;
  loading = true;
  videoThumbnail: string;
  videoPadding = 0;
  editProduct: Product;
  seller: boolean = false;
  currentItem: string | VideoMetaData;
  id: string;
  viewImage = false;
  currentImage: string = null;
  public carouselOptions: Partial<OwlCarouselOConfig> = {
    dots: true,
    autoplay: false,
    items: 3,
    responsive: {
      0: { items: 1 }
    }
  };
  navItems: NavigationItem[];
  more: Product[];
  productModalSubscription: Subscription;

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
    private userService: UserService,
    private lookupService: LookupService,
    private overlayService: OverlayService) { }

  ngOnInit() {
    this.currentUser = this.userService.user$.getValue();
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.mobile = result.matches;
    });
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      this.refreshProduct();
    });
    if (!this.productModalSubscription) {
      this.productModalSubscription = this.productService.productModalClosed$.subscribe(success => {
        if (success) {
          this.overlayService.close();
          this.refreshProduct();
        } else {
          this.overlayService.close();
        }
      })
    }
  }

  ngOnDestroy() {
    this.productModalSubscription.unsubscribe();
  }


  goToProduct(id) {
    this.navigationService.navigate({ path: '/products/detail/' + id });
  }

  goToProfile($event: any) {
    this.navigationService.navigate({ path: '/member/' + this.product.seller.id });
  }

  edit() {
    this.productService.showProductCreate(this.product, this.currentUser.id, this.product.type)
  }

  close() {
    this.overlayService.close();
  }

  carouselTranslated(event: any) {

  }

  setActiveItem(item: VideoMetaData | ImageSet) {
    if ((item as VideoMetaData).url) {
      this.currentItem = item as VideoMetaData;
      this.currentImage = null;
    } else {
      this.currentItem = (item as ImageSet).cropped;
      this.currentImage = (item as ImageSet).original;
    }
  }

  refreshProduct() {
    this.loading = true;
    this.productService.getProduct(this.id).subscribe(response => {
      if (this.currentUser && this.currentUser.id === response.product.sellerId) {
        this.seller = true;
      }
      if (!this.seller && this.currentUser) {
        this.productService.viewProduct(response.product.id).subscribe(() => {
        });
      }
      this.product = response.product;
      this.more = response.more;
      this.navItems = [];
      let item = this.lookupService.navLookup[this.product.categories.find(id => id.length === 4)];
      const navStack = [];
      while (item) {
        if (!(item.name && item.name.startsWith('All') && item.name !== 'All Products')) {
          navStack.push(item);
        }
        item = item.parent;
      }
      const length = navStack.length
      for (let i = 0; i < length; i++) {
        this.navItems.push(navStack.pop());
      }
      this.navItems.push({ path: `/products/${this.product.id}`, name: this.product.title });
      this.currentItem = this.product.videos[0] ? this.product.videos[0] : this.product.images[0].cropped;
      this.currentImage = this.product.videos[0] ? null : this.product.images[0].original;
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
      this.zone.run(() => {
        this.loading = false;
        this.ref.markForCheck();
      })
    }, err => console.log(err))
  }

  viewCurrentImage(image: ImageSet) {
    if (image) {
      this.currentImage = image.original;
    }
    this.productService.showImage(this.currentImage)
  }

  purchase() {
    this.navigationService.navigate({ path: `/sales/checkout/${this.product.id}` });
  }

  onClose() {
    this.overlayService.close();
  }
}
