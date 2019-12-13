import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopFiltersComponent } from './desktop-filters.component';

describe('DesktopFiltersComponent', () => {
  let component: DesktopFiltersComponent;
  let fixture: ComponentFixture<DesktopFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesktopFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
