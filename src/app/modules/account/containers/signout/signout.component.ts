import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationService } from '@app/shared/services/navigation.service';
import { UserService } from '@app/shared/services/user/user.service';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignoutComponent implements OnInit {

  constructor(private navigationService: NavigationService, private userService: UserService) { }

  ngOnInit() {
    this.userService.logout();
    this.navigationService.resetNavigation();
    this.navigationService.navigate({ path: '/' })
    this.navigationService.openAuthWindow();
  }

}
