import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkFacebookComponent } from './link-facebook.component';

describe('LinkFacebookComponent', () => {
  let component: LinkFacebookComponent;
  let fixture: ComponentFixture<LinkFacebookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkFacebookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkFacebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
