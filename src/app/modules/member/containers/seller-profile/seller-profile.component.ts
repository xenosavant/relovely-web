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

@Component({
  selector: 'app-seller-profile',
  templateUrl: './seller-profile.component.html',
  styleUrls: ['./seller-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SellerProfileComponent implements OnInit {

  @ViewChild('productCreateModal', { static: true }) productCreateModal: TemplatePortal<any>;

  @Input() user: UserDetail;
  @Input() currentUserId: string;
  @Input() owner = false;
  @Output() updateImage: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() action: EventEmitter<string> = new EventEmitter<string>();
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

  constructor(private route: ActivatedRoute,
    private overlayService: OverlayService,
    private userService: UserService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    // this.user.listings = products.filter(p => {
    //   return p.seller.username === this.user.username;
    // })
    if (this.owner) {
      this.showCreate = true;
    }

    this.following = this.user.followers.some(u => u.id === this.currentUserId);
    this.followingUsers = this.user.following;
    this.followerUsers = this.user.followers;
    console.log(this.followerUsers);

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

  update() {
    this.updateImage.emit(true);
  }

  onAction(action: string) {
    switch (action) {
      case 'follow':
        this.followUnfollow(true);
        break;
      case 'unfollow':
        this.followUnfollow(false);
        break;
      case 'edit':
        this.edit = true;
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
        this.loading = true;
        this.userService.updateUser(this.user.id,
          {
            firstName: this.editForm.get('first').value,
            lastName: this.editForm.get('last').value,
            username: this.editForm.get('username').value
          }).subscribe(user => {
            this.user.firstName = user.firstName;
            this.user.lastName = user.lastName;
            this.user.username = user.username;
            this.loading = false;
            this.edit = false;
            this.ref.markForCheck();
          }, err => {
            console.log(err);
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
        console.log(this.followerUsers.indexOf(this.followerUsers.find(u => u.id === this.currentUserId)));
        this.followerUsers.splice(this.followerUsers.indexOf(this.followerUsers.find(u => u.id === this.currentUserId)), 1);
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