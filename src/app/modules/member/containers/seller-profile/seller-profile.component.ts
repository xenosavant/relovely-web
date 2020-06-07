import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { UserDetail } from '../../../../shared/models/user-detail.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { users } from '@app/data/users.data';
import { products } from '@app/data/products.data';
import { TemplatePortal } from '@angular/cdk/portal';
import { OverlayService } from '@app/shared/services/overlay.service';
import { UserService } from '@app/shared/services/user/user.service';
import { Product } from '@app/shared/models/product.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserList } from '@app/shared/models/user-list.model';
import { UserAuth } from '@app/shared/models/user-auth.model';

@Component({
  selector: 'app-seller-profile',
  templateUrl: './seller-profile.component.html',
  styleUrls: ['./seller-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SellerProfileComponent implements OnInit {

  @ViewChild('productCreateModal', { static: true }) productCreateModal: TemplatePortal<any>;

  @Input() user: UserDetail;
  @Input() currentUser: UserAuth;
  @Input() owner = false;
  @Output() updateImage: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() action: EventEmitter<string> = new EventEmitter<string>();
  @Input() mobile: boolean;
  edit = false;
  users: UserDetail[];
  showCreate = false;
  editProduct: Product;
  editForm: FormGroup;
  loading = false;
  disableSave = true;
  actionProcessing = false;
  formWatcher: Subscription;
  following: boolean;
  followingUsers: UserList[];
  followerUsers: UserList[];
  error: string = null;
  saving = false;

  constructor(private route: ActivatedRoute,
    private overlayService: OverlayService,
    private userService: UserService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.owner) {
      this.showCreate = true;
    }

    this.following = this.user.followers.some(u => u.id === this.currentUser.id);
    this.followingUsers = this.user.following;
    this.followerUsers = this.user.followers;
  }

  showCreateModal($event: any) {
    this.editProduct = null;
    this.overlayService.open(this.productCreateModal);
  }

  showEditModal(product: any) {
    this.editProduct = product;
    this.overlayService.open(this.productCreateModal);
  }

  close() {
    this.overlayService.close();
  }

  onUpdate() {
    if (this.owner) {
      this.updateImage.emit(true);
    }
  }

  onAction(action: string) {
    console.log(action);
    switch (action) {
      case 'follow':
        this.followUnfollow(true);
        break;
      case 'unfollow':
        this.followUnfollow(false);
        break;
      case 'edit':
        this.edit = true;
        this.error = null;
        this.editForm = new FormGroup({
          first: new FormControl(this.user.firstName, [Validators.required]),
          last: new FormControl(this.user.lastName, [Validators.required]),
          username: new FormControl(this.user.username, [Validators.required]),
        });
        if (this.formWatcher) {
          this.formWatcher.unsubscribe()
        }
        this.formWatcher = this.editForm.valueChanges.subscribe(value => {
          this.disableSave = !this.editForm.valid;
        })
        this.disableSave = !this.editForm.valid;
        break;
      case 'save':
        this.saving = true;
        this.userService.updateUser(this.user.id,
          {
            firstName: this.editForm.get('first').value,
            lastName: this.editForm.get('last').value,
            username: this.editForm.get('username').value
          }).subscribe(user => {
            this.user.firstName = user.firstName;
            this.user.lastName = user.lastName;
            this.user.username = user.username;
            this.saving = false;
            this.edit = false;
            this.error = null;
            this.ref.markForCheck();
          }, err => {
            this.error = err.error.error.message;
            this.saving = false;
            this.ref.markForCheck();
          });
        break;
      case 'close':
        this.edit = false;
        break
    }
  }

  followUnfollow(follow: boolean) {
    this.actionProcessing = true;
    this.userService.followUser(this.user.id, follow).subscribe(() => {
      console.log('success');
      const me = this.userService.currentUser;
      if (follow) {
        this.followerUsers.push({
          id: me.id,
          username: me.username,
          profileImageUrl: me.profileImageUrl,
          type: me.type
        });
        this.followerUsers = Object.assign([], this.followerUsers);
        this.following = true;
      } else {
        this.following = false;
        this.followerUsers.splice(this.followerUsers.indexOf(this.followerUsers.find(u => u.id === this.currentUser.id)), 1);
        this.followerUsers = Object.assign([], this.followerUsers);
      }
      this.user.followers = this.followerUsers;
      this.user = Object.assign({}, this.user);
      this.actionProcessing = false;
      this.ref.markForCheck();
    }, err => {
      this.actionProcessing = false;
    })
  }
}
