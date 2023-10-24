import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeworderComponent } from './neworder.component';

describe('NeworderComponent', () => {
  let component: NeworderComponent;
  let fixture: ComponentFixture<NeworderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NeworderComponent]
    });
    fixture = TestBed.createComponent(NeworderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
