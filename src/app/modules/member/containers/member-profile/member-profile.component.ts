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

  @Input() currentUserId: string;
  following: UserList[];
  products: Product[];
  edit = false;
  editForm: FormGroup;
  formWatcher: Subscription;
  disableSave = true;
  loading = false;
  actionProcessing = false;

  constructor(private userService: UserService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.following = this.user.following;
  }

  update() {
    this.updateImage.emit(true);
  }


  onAction(action: string) {
    switch (action) {
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
}
