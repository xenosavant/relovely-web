import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { UserService } from '@app/shared/services/user/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent implements OnInit {

  public loading = true;
  public form: FormGroup;
  public code: string;
  public showForm = false;

  constructor(private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      password: new FormControl('', [Validators.required]),
      verifyPassword: new FormControl('', [Validators.required]),
    });
    this.code = this.activatedRoute.snapshot.queryParams['code'];
    if (this.code) {
      this.showForm = true;
    }
    this.loading = false;
  }

  submit() {
    this.loading = true;
    this.authService.resetPassword({
      code: this.code.replace(/ /g, '+'),
      password: this.form.value['password']
    }).subscribe(response => {
      this.router.navigate(['/'], { queryParams: { signin: true } });
      this.loading = false;
    });
  }

}
