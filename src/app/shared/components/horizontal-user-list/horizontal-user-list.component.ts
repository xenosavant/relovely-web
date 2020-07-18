import { Component, OnInit, ChangeDetectionStrategy, Input, ElementRef, ViewChild } from '@angular/core';
import { UserList } from '@app/shared/models/user-list.model';
import { NavigationService } from '@app/shared/services/navigation/navigation.service';

@Component({
  selector: 'app-horizontal-user-list',
  templateUrl: './horizontal-user-list.component.html',
  styleUrls: ['./horizontal-user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HorizontalUserListComponent implements OnInit {

  @Input() users: UserList[];
  @ViewChild('list', { static: true }) pager: ElementRef;

  constructor(private navigationService: NavigationService) { }

  ngOnInit() {

  }

  goToUser(id: string) {
    this.navigationService.navigate({ path: `/member/${id}` });
  }

  scrollLeft() {
    this.pager.nativeElement.scrollTo({ left: (this.pager.nativeElement.scrollLeft - this.pageWidth), behavior: 'smooth' });
  }

  scrollRight() {
    this.pager.nativeElement.scrollTo({ left: (this.pager.nativeElement.scrollLeft + this.pageWidth), behavior: 'smooth' });
  }

  get pageWidth() {
    return this.pager.nativeElement.scrollWidth / this.users.length * 4;
  }


}
