import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesPayComponent } from './services-pay.component';

describe('ServicesPayComponent', () => {
  let component: ServicesPayComponent;
  let fixture: ComponentFixture<ServicesPayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServicesPayComponent]
    });
    fixture = TestBed.createComponent(ServicesPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
