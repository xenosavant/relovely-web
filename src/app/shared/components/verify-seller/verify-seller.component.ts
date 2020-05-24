import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LookupService } from '@app/shared/services/lookup/lookup.service';
import { State } from '@app/shared/services/lookup/state';
import { UserService } from '@app/shared/services/user/user.service';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '@env/environment';

@Component({
  selector: 'app-verify-seller',
  templateUrl: './verify-seller.component.html',
  styleUrls: ['./verify-seller.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifySellerComponent implements OnInit {

  @Output() close: EventEmitter<any> = new EventEmitter;

  uploadUrl = environment.apiUrl + '/users/add-document';
  states: State[];
  form: FormGroup;
  error: string = null;
  loading: boolean = false;
  tosAccept: number;
  frontImage: string;
  backImage: string;
  frontUploader: FileUploader;
  backUploader: FileUploader;
  frontError: string;
  backError: string;
  frontUploading: boolean;
  backUploading: boolean;

  constructor(private lookupService: LookupService, private userService: UserService, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.states = this.lookupService.states;
    this.form = new FormGroup({
      first: new FormControl('', [Validators.required]),
      last: new FormControl('', [Validators.required]),
      birthday: new FormControl(null, [Validators.required]),
      ssn: new FormControl(null, [Validators.required, Validators.minLength(11)]),
      phone: new FormControl('', [Validators.required, Validators.minLength(12)]),
      line1: new FormControl('', [Validators.required]),
      line2: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      zip: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      country: new FormControl({ value: 'United States', disabled: true }, [Validators.required]),
      tos: new FormControl(null, [Validators.requiredTrue]),
    })
    this.form.get('tos').valueChanges.subscribe(val => {
      if (val === true) {
        this.tosAccept = Math.floor(Date.now() / 1000);
      }
    });
    const jwt = this.userService.jwt;
    this.frontUploader = new FileUploader({ url: this.uploadUrl, authToken: 'Bearer ' + jwt });
    this.backUploader = new FileUploader({ url: this.uploadUrl, authToken: 'Bearer ' + jwt });
    this.frontUploader.onAfterAddingFile = (file) => {
      const validity = this.verifyFile(file);
      if (validity === 'valid') {
        this.frontUploading = true;
        this.frontUploader.uploadItem(file);
      } else {
        this.frontError = validity;
      }
    }
    this.backUploader.onAfterAddingFile = (file) => {
      const validity = this.verifyFile(file);
      if (validity === 'valid') {
        this.backUploading = true;
        this.backUploader.uploadItem(file);
      } else {
        this.backError = validity;
      }
    }
    this.frontUploader.onSuccessItem = (item, response, status, headers) => {
      this.frontUploading = false;
      this.frontImage = response;
      this.ref.markForCheck();
    }
    this.backUploader.onSuccessItem = (item, response, status, headers) => {
      this.backUploading = false;
      this.frontImage = response;
    }
  }

  onClose(event: any) {
    this.close.emit();
  }

  onSave() {
    const birth = (this.form.get('birthday').value as Date);
    this.loading = true;
    this.userService.verifySeller({
      firstName: this.form.get('first').value,
      lastName: this.form.get('last').value,
      birthDay: birth.getDate(),
      birthMonth: birth.getMonth(),
      birthYear: birth.getFullYear(),
      phone: this.form.get('phone').value.replace(/-/g, ''),
      email: this.form.get('email').value,
      ssn: this.form.get('ssn').value.replace(/-/g, ''),
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
      this.error = err.error.error;
      console.log(err);
    });
  }

  onFrontUpload(event) {
    console.log(event.target.files[0]);
  }

  verifyFile(event: any): string {
    const file: File = event.file;
    if (!file.type.startsWith('image')) {
      return 'File is not an image';
    }
    if (file.size > 10000000) {
      return 'File is too large, must be less than 10MB.'
    }
    return 'valid';
  }

}
