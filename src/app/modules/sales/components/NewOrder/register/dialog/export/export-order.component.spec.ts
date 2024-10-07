import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportOrderComponent } from './export-order.component';

describe('ExportOrderComponent', () => {
  let component: ExportOrderComponent;
  let fixture: ComponentFixture<ExportOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExportOrderComponent]
    });
    fixture = TestBed.createComponent(ExportOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
