import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { AdminService } from '@app/shared/services/admin/admin.service';
import { UserDetail } from '@app/shared/models/user-detail.model';
import { UserAuth } from '@app/shared/models/user-auth.model';
import { subscribeOn } from 'rxjs/operators';

@Component({
  selector: 'app-create-promo',
  templateUrl: './create-promo.component.html',
  styleUrls: ['./create-promo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePromoComponent implements OnInit {

  @Output()
  close: EventEmitter<any> = new EventEmitter;

  form: FormGroup;
  sellers: UserAuth[];
  options: string[] = ['discount', 'freeShipping'];
  discounts: number[] = [5, 10, 15, 20, 25, 30];
  saving: boolean = false;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.form = new FormGroup({
      code: new FormControl('', [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      seller: new FormControl(null),
      discount: new FormControl(null)
    });
    this.adminService.getSellers(false).subscribe(sellers => {
      console.log(sellers)
      this.sellers = sellers.filter(s => s.seller.verificationStatus === 'verified');
    })
  }

  onSave() {
    this.saving = true;
    this.adminService.createPromo({
      code: this.form.get('code').value,
      type: this.form.get('type').value,
      sellerId: this.form.get('seller').value,
      discountPercent: this.form.get('discount').value
    }).subscribe(() => {
      this.close.emit();
    })
  }

  onClose() {
    this.close.emit();
  }

}
