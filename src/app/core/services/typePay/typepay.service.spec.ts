import { TestBed } from '@angular/core/testing';

import { TypepayService } from './typepay.service';

describe('TypepayService', () => {
  let service: TypepayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypepayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
