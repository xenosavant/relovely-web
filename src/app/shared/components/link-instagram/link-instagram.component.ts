import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-link-instagram',
  templateUrl: './link-instagram.component.html',
  styleUrls: ['./link-instagram.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkInstagramComponent implements OnInit {

  @Output() close: EventEmitter<boolean> = new EventEmitter();
  loading = false;

  linkUrl = environment.instagramAuthUrl + `&client_id=${environment.instagramClientId}&redirect_uri=${environment.instagramLinkRedirectUrl}`;

  constructor() { }

  ngOnInit() {

  }

  linkInstagram() {
    this.loading = true;
    console.log(this.linkUrl);
    // location.replace(this.linkUrl);
  }

  onClose() {
    this.close.emit();
  }

}
