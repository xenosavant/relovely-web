import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkInstagramComponent } from './link-instagram.component';

describe('LinkInstagramComponent', () => {
  let component: LinkInstagramComponent;
  let fixture: ComponentFixture<LinkInstagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkInstagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkInstagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
