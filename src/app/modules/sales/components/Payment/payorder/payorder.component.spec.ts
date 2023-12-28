import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayorderComponent } from './payorder.component';

describe('PayorderComponent', () => {
  let component: PayorderComponent;
  let fixture: ComponentFixture<PayorderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayorderComponent]
    });
    fixture = TestBed.createComponent(PayorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
