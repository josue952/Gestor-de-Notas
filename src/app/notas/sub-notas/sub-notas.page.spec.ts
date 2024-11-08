import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubNotasPage } from './sub-notas.page';

describe('SubNotasPage', () => {
  let component: SubNotasPage;
  let fixture: ComponentFixture<SubNotasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SubNotasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
