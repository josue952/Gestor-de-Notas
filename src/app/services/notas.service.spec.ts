import { TestBed } from '@angular/core/testing';

import { NotasService } from './notas.service';

describe('AuthService', () => {
  let service: NotasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
