import { TestBed } from '@angular/core/testing';

import { GradosMateriasService } from './grados-materias.service';

describe('GradosMateriasService', () => {
  let service: GradosMateriasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GradosMateriasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
