import { TestBed } from '@angular/core/testing';

import { SubNotasService } from './sub-notas.service';

describe('SubNotasService', () => {
  let service: SubNotasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubNotasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
