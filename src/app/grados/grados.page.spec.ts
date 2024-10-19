import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GradosPage } from './grados.page';

describe('GradosPage', () => {
  let component: GradosPage;
  let fixture: ComponentFixture<GradosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GradosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
