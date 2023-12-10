import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaypendingComponent } from './paypending.component';

describe('PaypendingComponent', () => {
  let component: PaypendingComponent;
  let fixture: ComponentFixture<PaypendingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaypendingComponent]
    });
    fixture = TestBed.createComponent(PaypendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
