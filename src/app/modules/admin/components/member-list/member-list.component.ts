import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AdminService } from '@app/shared/services/admin/admin.service';
import { UserAuth } from '@app/shared/models/user-auth.model';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberListComponent implements OnInit {


  members: UserAuth[];

  constructor(private adminService: AdminService, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.getBuyers();
  }

  getBuyers() {
    this.adminService.getMembers().subscribe(buyers => {
      this.members = buyers;
      this.ref.markForCheck();
    })
  }

}
