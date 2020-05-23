import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCardInputComponent } from './payment-card-input.component';

describe('PaymentCardInputComponent', () => {
  let component: PaymentCardInputComponent;
  let fixture: ComponentFixture<PaymentCardInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentCardInputComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCardInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
