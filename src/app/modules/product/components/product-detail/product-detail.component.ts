import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Product } from '@app/shared/models/product.model';
import { OwlCarouselOConfig } from 'ngx-owl-carousel-o/lib/carousel/owl-carousel-o-config';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NavigationService } from '@app/shared/services/navigation.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent implements OnInit {

  @Input() product: Product;

  public carouselOptions: Partial<OwlCarouselOConfig> = {
    dots: true,
    autoplay: false,
    responsive: {
      0: { items: 1 }
    }
  };

  constructor(private router: Router, private navigationService: NavigationService) {

  }

  ngOnInit() {
  }

  carouselTranslated(event: any) {

  }

  goToProfile($event: any) {
    this.navigationService.navigate({ path: '/member/' + this.product.userId });
  }
}
