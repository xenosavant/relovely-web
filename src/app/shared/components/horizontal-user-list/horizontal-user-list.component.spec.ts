import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalUserListComponent } from './horizontal-user-list.component';

describe('HorizontalUserListComponent', () => {
  let component: HorizontalUserListComponent;
  let fixture: ComponentFixture<HorizontalUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizontalUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
