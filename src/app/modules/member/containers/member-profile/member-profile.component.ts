import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { users } from '@app/data/users.data';
import { Product } from '@app/shared/models/product.model';
import { products } from '@app/data/products.data';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '@app/shared/services/user/user.service';
import { UserList } from '@app/shared/models/user-list.model';

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberProfileComponent implements OnInit {

  @Input()
  user: UserDetail;
  @Input()
  owner = false;
  @Output() updateImage: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() action: EventEmitter<string> = new EventEmitter<string>();
  @Input() mobile: boolean;

  @Input() currentUser: UserDetail;
  following: UserList[];
  products: Product[];
  edit = false;
  editForm: FormGroup;
  formWatcher: Subscription;
  disableSave = true;
  loading = false;
  actionProcessing = false;
  error: string = null;
  saving = false;

  constructor(private userService: UserService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.following = this.user.following;
    if (this.user.usernameReset) {
      this.error = 'Your username has been claimed by another user. Please choose a new one.'
    }
  }

  onUpdate() {
    if (this.owner) {
      this.updateImage.emit(true);
    }
  }


  onAction(action: string) {
    switch (action) {
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


  goToInstagram() {
    window.open(`https://instagram.com/${this.user.instagramUsername}`)
  }

}
