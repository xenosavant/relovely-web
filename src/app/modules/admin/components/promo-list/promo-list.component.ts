import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Promo } from '@app/shared/models/promo.model';
import { AdminService } from '@app/shared/services/admin/admin.service';
import { TemplatePortal } from '@angular/cdk/portal';
import { OverlayService } from '@app/shared/services/overlay.service';

@Component({
  selector: 'app-promo-list',
  templateUrl: './promo-list.component.html',
  styleUrls: ['./promo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromoListComponent implements OnInit {

  @ViewChild('promoModal', { static: true }) promoModal: TemplatePortal<any>;

  promos: Promo[];
  constructor(private adminService: AdminService, private overlayService: OverlayService, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.getPromos();
  }

  getPromos() {
    this.adminService.getPromos().subscribe(promos => {
      this.promos = promos;
      this.ref.markForCheck();
    })
  }

  createPromo() {
    this.overlayService.open(this.promoModal);
  }

  closeModal() {
    this.overlayService.close();
  }
  onSave() {
    this.overlayService.close();
    this.getPromos();
  }

}
