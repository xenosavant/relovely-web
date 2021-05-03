import { Component, OnInit, ChangeDetectionStrategy, Input, NgZone, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { UserDetail } from '../../../../shared/models/user-detail.model';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@app/shared/services/user/user.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ImageSet } from '@app/shared/interfaces/image-set.interface';
import { FileUploadService } from '@app/shared/services/file-upload.service';
import { concatMap, tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { UserAuth } from '@app/shared/models/user-auth.model';
import { HeaderService } from '@app/shared/services/header.service';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';
const loadImage = require('blueimp-load-image');

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {

  public imageChangedEvent: any = null;
  crop = false;
  user: UserDetail;
  users: UserDetail[];
  mobile: boolean;
  owner = false;
  loading = true;
  currentUser: UserAuth;
  editForm: FormGroup;
  edit = false;
  currentImage: string;
  public form: FormGroup;
  constructor(private breakpointObserver: BreakpointObserver, private route: ActivatedRoute,
    private navigationService: NavigationService,
    private userService: UserService, private zone: NgZone, private ref: ChangeDetectorRef,
    private uploadService: FileUploadService,
    private headerService: HeaderService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      const id = param.get('id');
      this.currentUser = this.userService.user$.getValue();
      if (id === 'profile' && !this.currentUser) {
        this.navigationService.navigate({ path: '/' });
      }
      if (this.currentUser && (id === 'profile' || id === this.currentUser.id || id === this.currentUser.username)) {
        this.userService.getUser(this.userService.user$.getValue().id).subscribe(user => {
          this.owner = true;
          this.user = user;
          this.loading = false;
          this.ref.markForCheck();
        });
      } else {
        this.userService.getUser(id).subscribe(user => {
          this.owner = false;
          this.user = user;
          this.ref.markForCheck();
          this.loading = false;
        });
      }
      this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
        this.mobile = result.matches;
      });
    })
  }

  onCloseCropper($event: any) {
    this.crop = false;
    this.headerService.hideHeader(false);
  }

  onImageCropped(image: ImageSet) {
    let tempUrl: string;
    this.uploadService.upload('data:image/jpeg;base64,' + image, `users/${this.user.id}/images`, 'profile').pipe(
      tap(response => {
        tempUrl = response.secure_url;
      }),
      concatMap(response =>
        this.userService.updateUser(this.user.id, { profileImageUrl: response.secure_url })
      )).subscribe(result => {
        this.headerService.hideHeader(false);
        this.crop = false;
        this.user = { ...this.user, profileImageUrl: tempUrl }
        this.ref.markForCheck();
      }, error => {
        this.headerService.hideHeader(false);
        this.crop = false;
        this.ref.markForCheck();
      })
  }

  public onUpdateImage($event: any): void {
    this.imageChangedEvent = $event;
    this.currentImage = null;
    const context = this;
    loadImage($event.target.files[0], {
      orientation: true,
      maxHeight: 1333,
      maxwidth: 1333,
      contain: true,
      canvas: true
    }).then(function (data) {
      const canvas = document.createElement("canvas");
      canvas.width = data.image.width;
      canvas.height = data.image.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(data.image, 0, 0, data.image.width, data.image.height);
      const dataURL = canvas.toDataURL("image/jpg");
      context.currentImage = dataURL;
      context.crop = true;
      context.ref.markForCheck();
    })
  }
}
