import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserAuth } from '@app/shared/models/user-auth.model';
import { AdminService } from '@app/shared/services/admin/admin.service';

@Component({
  selector: 'app-seller-list',
  templateUrl: './seller-list.component.html',
  styleUrls: ['./seller-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SellerListComponent implements OnInit {

  createForm: FormGroup;
  sellers: UserAuth[];
  error: string;


  constructor(private adminService: AdminService,
    private ref: ChangeDetectorRef) { }


  ngOnInit() {
    this.createForm = new FormGroup({
      first: new FormControl(''),
      last: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required])
    });
    this.getSellers();
  }

  create() {
    this.adminService.createSeller({
      firstName: this.createForm.get('first').value,
      lastName: this.createForm.get('last').value,
      email: this.createForm.get('email').value,
      instagramUsername: this.createForm.get('username').value
    }).subscribe(() => {
      this.getSellers();
    }, err => {
      this.error = err.error.error.message;
    })
  }

  getSellers() {
    this.adminService.getSellers(true).subscribe(sellers => {
      this.sellers = sellers;
      this.ref.markForCheck();
    })
  }

  feature(seller: UserAuth) {
    this.approvalCall(seller.email, false, true);
  }

  approve(seller: UserAuth) {
    this.approvalCall(seller.email, false, false);
  }

  reject(seller: UserAuth) {
    this.approvalCall(seller.email, true);
  }

  approvalCall(email: string, reject: boolean, featured: boolean = false) {
    this.adminService.approveSeller({
      email: email,
      approved: !reject,
      featured: featured
    }).subscribe(() => {
      this.getSellers();
    }, err => {
      this.error = err.error.error.message;
    })
  }


}
