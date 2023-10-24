import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingservicesComponent } from './pendingservices.component';

describe('PendingservicesComponent', () => {
  let component: PendingservicesComponent;
  let fixture: ComponentFixture<PendingservicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingservicesComponent]
    });
    fixture = TestBed.createComponent(PendingservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
