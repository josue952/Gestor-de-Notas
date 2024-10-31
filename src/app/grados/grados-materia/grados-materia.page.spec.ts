import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GradosMateriaPage } from './grados-materia.page';

describe('GradosMateriaPage', () => {
  let component: GradosMateriaPage;
  let fixture: ComponentFixture<GradosMateriaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GradosMateriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
