import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeFilterGroupComponent } from './size-filter-group.component';

describe('SizeFilterGroupComponent', () => {
  let component: SizeFilterGroupComponent;
  let fixture: ComponentFixture<SizeFilterGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SizeFilterGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SizeFilterGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
