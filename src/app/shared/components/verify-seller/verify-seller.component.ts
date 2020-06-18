import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LookupService } from '@app/shared/services/lookup/lookup.service';
import { State } from '@app/shared/services/lookup/state';
import { UserService } from '@app/shared/services/user/user.service';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '@env/environment';
import { VerificationError } from '@app/shared/services/user/verification-error';
import { SellerVerificationRequest } from '@app/shared/services/user/seller-verification.request';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-verify-seller',
  templateUrl: './verify-seller.component.html',
  styleUrls: ['./verify-seller.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifySellerComponent implements OnInit {

  @Output() close: EventEmitter<any> = new EventEmitter;

  @Input() verification: VerificationError;

  uploadUrl = environment.apiUrl + '/users/add-document';
  states: State[];
  form: FormGroup;
  error: string = null;
  loading: boolean = true;
  tosAccept: number;
  frontImage: string;
  backImage: string;
  frontUploader: FileUploader;
  backUploader: FileUploader;
  frontError: string;
  backError: string;
  frontUploading: boolean;
  backUploading: boolean;
  formFields: string[] = [];
  update = false;
  mobile: boolean;

  constructor(private lookupService: LookupService,
    private userService: UserService,
    private ref: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
    this.states = this.lookupService.states;
    if (this.verification) {
      this.update = true;
      this.form = new FormGroup({});
      this.verification.missingData.forEach(item => {
        this.setFormData(item);
      });
      this.ref.markForCheck();
    }
    else {
      this.formFields = ['name', 'birthday', 'ssn4', 'phone', 'address', 'tos'];
      this.form = new FormGroup({
        first: new FormControl('', [Validators.required]),
        last: new FormControl('', [Validators.required]),
        birthday: new FormControl(null, [Validators.required]),
        ssn4: new FormControl(null, [Validators.required, Validators.minLength(4)]),
        phone: new FormControl('', [Validators.required, Validators.minLength(12)]),
        line1: new FormControl('', [Validators.required]),
        line2: new FormControl(''),
        city: new FormControl('', [Validators.required]),
        state: new FormControl(null, [Validators.required]),
        zip: new FormControl('', [Validators.required]),
        email: new FormControl(this.userService.currentUser.email, [Validators.required]),
        country: new FormControl({ value: 'United States', disabled: true }, [Validators.required]),
        tos: new FormControl(false, [Validators.requiredTrue])
      });
      this.watchTos();
    }
    const jwt = this.userService.jwt;
    this.frontUploader = new FileUploader({ url: this.uploadUrl, authToken: 'Bearer ' + jwt });
    this.backUploader = new FileUploader({ url: this.uploadUrl, authToken: 'Bearer ' + jwt });
    this.frontUploader.onAfterAddingFile = (file) => {
      const validity = this.verifyFile(file);
      if (validity === 'valid') {
        this.frontUploading = true;
        file.withCredentials = false;
        this.frontUploader.uploadItem(file);
      } else {
        this.frontError = validity;
        this.ref.markForCheck()
      }
    }
    this.backUploader.onAfterAddingFile = (file) => {
      const validity = this.verifyFile(file);
      if (validity === 'valid') {
        this.backUploading = true;
        file.withCredentials = false;
        this.backUploader.uploadItem(file);
      } else {
        this.backError = validity;
        this.ref.markForCheck()
      }
    }
    this.frontUploader.onSuccessItem = (item, response, status, headers) => {
      this.frontError = null;
      this.frontUploading = false;
      this.frontImage = response;
      this.ref.markForCheck();
    }
    this.backUploader.onSuccessItem = (item, response, status, headers) => {
      this.backError = null;
      this.backUploading = false;
      this.backImage = response;
      this.ref.markForCheck();
    }
    this.frontUploader.onErrorItem = (item, response, status, headers) => {
      this.frontUploading = false;
      this.frontError = 'Upload failed';
      this.ref.markForCheck();
    }
    this.backUploader.onErrorItem = (item, response, status, headers) => {
      this.backUploading = false;
      this.backError = 'Upload failed';
      this.ref.markForCheck();
    }
    this.breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.mobile = result.matches;
    });
    this.loading = false;
  }

  setFormData(item: string) {
    if (/dob/.test(item)) {
      if (this.formFields.indexOf('birthday') === -1) {
        this.formFields.push('birthday');
        this.form.addControl('birthday', new FormControl(null, [Validators.required]));
      }
    }
    if (/id_number/.test(item)) {
      if (this.formFields.indexOf('ssn') === -1) {
        this.formFields.push('ssn');
        this.form.addControl('ssn', new FormControl(null, [Validators.required, Validators.minLength(11)]));
      }
    }
    if (/first_name/.test(item) || /last_name/.test(item)) {
      if (this.formFields.indexOf('name') === -1) {
        this.formFields.push('name');
        this.form.addControl('first', new FormControl(null, [Validators.required]));
        this.form.addControl('last', new FormControl(null, [Validators.required]));
      }
    }
    if (/address/.test(item)) {
      if (this.formFields.indexOf('address') === -1) {
        this.formFields.push('address');
        this.form.addControl('line1', new FormControl(null, [Validators.required]));
        this.form.addControl('line2', new FormControl(null, [Validators.required]));
        this.form.addControl('city', new FormControl(null, [Validators.required]));
        this.form.addControl('state', new FormControl(null, [Validators.required]));
        this.form.addControl('zip', new FormControl(null, [Validators.required]));
        this.form.addControl('country', new FormControl({ value: 'United States', disabled: true }, [Validators.required]));
      }
    }
    if (/phone/.test(item)) {
      if (this.formFields.indexOf('phone') === -1) {
        this.formFields.push('phone');
        this.form['phone'] = new FormControl('', [Validators.required, Validators.minLength(12)]);
      }
    }
    if (/document/.test(item)) {
      if (this.formFields.indexOf('document') === -1) {
        this.formFields.push('document');
      }
    }
    if (/tos/.test(item)) {
      if (this.formFields.indexOf('tos') === -1) {
        this.formFields.push('tos');
        this.form.addControl('tos', new FormControl(null, [Validators.requiredTrue]));
        this.watchTos();
      }
    }
  }

  onClose(event: any) {
    this.close.emit();
  }

  watchTos() {
    this.form.get('tos').valueChanges.subscribe(val => {
      if (val === true) {
        this.tosAccept = Math.floor(Date.now() / 1000);
      }
    });
  }

  isFormValid() {
    return this.form.valid &&
      (this.formFields.indexOf('document') > -1 ? this.frontImage && this.backImage && !this.frontError
        && !this.backError && !this.backUploading && !this.frontUploading : true)
  }

  onSave() {
    this.loading = true;
    if (this.update) {
      const updates: Partial<SellerVerificationRequest> = {};
      if (this.formFields.indexOf('name') > -1) {
        updates.firstName = this.form.get('first').value;
        updates.lastName = this.form.get('last').value;
      }
      if (this.formFields.indexOf('birthday') > -1) {
        const birth = (this.form.get('birthday').value as Date);
        updates.birthDay = birth.getDate();
        updates.birthMonth = birth.getMonth();
        updates.birthYear = birth.getFullYear();
      }
      if (this.formFields.indexOf('ssn') > -1) {
        updates.ssn = this.form.get('ssn').value.replace(/-/g, '');
      }
      if (this.formFields.indexOf('address') > -1) {
        updates.address = {
          city: this.form.get('city').value,
          state: this.form.get('state').value,
          zip: this.form.get('zip').value,
          line1: this.form.get('line1').value,
          line2: this.form.get('line2').value,
          country: 'US'
        }
      }
      if (this.formFields.indexOf('phone') > -1) {
        updates.phone = this.form.get('phone').value;
      }
      if (this.formFields.indexOf('document') > -1) {
        updates.documentBack = this.backImage;
        updates.documentFront = this.frontImage;
      }
      if (this.formFields.indexOf('tos') > -1) {
        updates.phone = this.form.get('phone').value;
      }
      this.userService.updateSeller(updates).subscribe(user => {
        this.loading = false;
        this.close.emit();
      }, err => {
        this.loading = false;
        this.error = 'Something went wrong. Please try again.'
      })
    } else {
      const birth = (this.form.get('birthday').value as Date);
      this.userService.verifySeller({
        firstName: this.form.get('first').value,
        lastName: this.form.get('last').value,
        birthDay: birth.getDate(),
        birthMonth: birth.getMonth(),
        birthYear: birth.getFullYear(),
        phone: this.form.get('phone').value.replace(/-/g, ''),
        email: this.form.get('email').value,
        ssn4: this.form.get('ssn4').value,
        tosAcceptDate: this.tosAccept,
        address: {
          city: this.form.get('city').value,
          state: this.form.get('state').value,
          zip: this.form.get('zip').value,
          line1: this.form.get('line1').value,
          line2: this.form.get('line2').value,
          country: 'US'
        },
        documentBack: this.backImage,
        documentFront: this.frontImage
      }).subscribe(response => {
        this.loading = false;
        this.close.emit();
      }, err => {
        this.loading = false;
        this.error = 'Something went wrong. Please try again.'
      });
    }
  }

  onFrontUpload(event) {

  }

  verifyFile(event: any): string {
    const file: File = event.file;
    console.log(file.name);
    if (!RegExp('([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg|HEIC)', 'g').test(file.name)) {
      return 'file is not an image';
    }
    if (file.size > 10000000) {
      return 'File is too large, must be less than 10MB.'
    }
    return 'valid';
  }

}
