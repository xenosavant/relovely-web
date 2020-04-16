import { Component, OnInit, ChangeDetectionStrategy, Input, NgZone, ChangeDetectorRef } from '@angular/core';
import { UserDetail } from '../../../../shared/models/user-detail.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { products } from '@app/data/products.data';
import { UserService } from '@app/shared/services/user/user.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ImageSet } from '@app/shared/interfaces/image-set.interface';
import { FileUploadService } from '@app/shared/services/file-upload.service';
import { concatMap, tap } from 'rxjs/operators';

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
  constructor(private breakpointObserver: BreakpointObserver, private route: ActivatedRoute,
    private userService: UserService, private zone: NgZone, private ref: ChangeDetectorRef,
    private uploadService: FileUploadService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      const id = param.get('id');
      if (!this.user || (this.user && id !== this.user.id)) {
        if (id !== 'profile') {
          this.userService.getUser(id).subscribe(user => {
            this.owner = false;
            this.user = user;
            this.ref.markForCheck();
            this.loading = false;
          })
        } else {
          this.userService.getUser(this.userService.currentUser.id).subscribe(user => {
            this.owner = true;
            this.user = user;
            this.loading = false;
            this.ref.markForCheck();
          });
        }
        this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
          this.mobile = result.matches;
        });
      }
    });
  }

  onCloseCropper($event: any) {
    this.crop = false;
  }

  onImageCropped(image: ImageSet) {
    let tempUrl: string;
    this.uploadService.upload('data:image/jpeg;base64,' + image, `users/${this.user.id}/images`, 'image', 'profile').pipe(
      tap(response => {
        tempUrl = response.secure_url;
      }),
      concatMap(response =>
        this.userService.updateUser(this.user.id, { profileImageUrl: response.secure_url })
      )).subscribe(result => {
        this.crop = false;
        this.user = { ...this.user, profileImageUrl: tempUrl }
      }, error => {
        this.crop = false;
      })
  }

  public onUpdateImage($event: any): void {
    this.imageChangedEvent = $event;
    this.crop = true;
  }
}
