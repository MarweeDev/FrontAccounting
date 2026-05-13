import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewShoppingComponent } from './view-shopping.component';

describe('ViewShoppingComponent', () => {
  let component: ViewShoppingComponent;
  let fixture: ComponentFixture<ViewShoppingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewShoppingComponent]
    });
    fixture = TestBed.createComponent(ViewShoppingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
