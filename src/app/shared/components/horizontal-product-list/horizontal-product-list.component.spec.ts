import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalProductListComponent } from './horizontal-product-list.component';

describe('HorizontalProductListComponent', () => {
  let component: HorizontalProductListComponent;
  let fixture: ComponentFixture<HorizontalProductListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizontalProductListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
