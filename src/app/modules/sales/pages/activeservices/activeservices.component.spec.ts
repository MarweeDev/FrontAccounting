import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveservicesComponent } from './activeservices.component';

describe('ActiveservicesComponent', () => {
  let component: ActiveservicesComponent;
  let fixture: ComponentFixture<ActiveservicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActiveservicesComponent]
    });
    fixture = TestBed.createComponent(ActiveservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
