import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-link-facebook',
  templateUrl: './link-facebook.component.html',
  styleUrls: ['./link-facebook.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkFacebookComponent implements OnInit {

  @Output() close: EventEmitter<boolean> = new EventEmitter();
  loading = false;

  linkFacebookUrl = environment.facebookAuthUrl + `?client_id=${environment.facebookClientId}&redirect_uri=${environment.facebooLinkRedirectUrl}&scope=email&response_type=code`;
  constructor() { }

  ngOnInit() {
  }

  linkFacebook() {
    this.loading = true;
    location.replace(this.linkFacebookUrl);
  }

  onClose() {
    this.close.emit(true);
  }

}
