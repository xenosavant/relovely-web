import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminService } from '@app/shared/services/admin/admin.service';
import { UserAuth } from '@app/shared/models/user-auth.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  createForm: FormGroup;
  sellers: UserAuth[];
  error: string;

  constructor(private adminService: AdminService, private ref: ChangeDetectorRef) { }

  ngOnInit() {

  }



}
