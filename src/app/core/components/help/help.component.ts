import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserAuth } from '@app/shared/models/user-auth.model';
import { UserService } from '@app/shared/services/user/user.service';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpComponent implements OnInit {

  form: FormGroup;
  saving = false;
  mobile: boolean;
  success = false;

  currentUser: UserAuth;

  constructor(private userService: UserService, private breakpointObserver: BreakpointObserver) {

  }

  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 899px)']).subscribe(result => {
      this.mobile = result.matches;
    })
    this.currentUser = this.userService.user$.getValue();
    this.form = new FormGroup({
      email: new FormControl(this.currentUser ? this.currentUser.email : '', [Validators.required]),
      body: new FormControl('', [Validators.required]),
    })
  }

  onSubmit() {
    this.userService.support({ email: this.form.get('email').value, body: this.form.get('body').value }).subscribe(() => {
      this.success = true;
    })
  }

}
