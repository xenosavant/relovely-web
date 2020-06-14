import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TemplatePortal } from '@angular/cdk/portal';
import { OverlayService } from '@app/shared/services/overlay.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit {

  @ViewChild('applyToSell', { static: true }) sellerModal: TemplatePortal<any>;

  mobile: boolean;
  constructor(private breakpointObserver: BreakpointObserver,
    private overlayService: OverlayService) { }

  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.mobile = result.matches;
    })
  }

  onSell() {
    this.overlayService.open(this.sellerModal);
  }

  onClose(success: boolean) {
    this.overlayService.close();
  }

}
