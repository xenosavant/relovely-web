import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorFilterComponent } from './color-filter.component';

describe('ColorFilterComponent', () => {
  let component: ColorFilterComponent;
  let fixture: ComponentFixture<ColorFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
