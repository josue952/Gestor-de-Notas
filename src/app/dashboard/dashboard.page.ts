import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  userType: 'Alumno' | 'Maestro' = 'Maestro'; // Cambiar a 'teacher' para ver el dashboard de profesor
  
  studentGrades = [
    { subject: 'Matemáticas', grade: 85 },
    { subject: 'Ciencias', grade: 92 },
    { subject: 'Historia', grade: 78 },
    { subject: 'Literatura', grade: 88 },
  ];

  pendingGrades = [
    { student: 'Ana García', subject: 'Matemáticas' },
    { student: 'Carlos López', subject: 'Ciencias' },
    { student: 'María Rodríguez', subject: 'Historia' },
    { student: 'Juan Pérez', subject: 'Literatura' },
  ];

  constructor() { }

  getAverageGrade(): number {
    const sum = this.studentGrades.reduce((acc, grade) => acc + grade.grade, 0);
    return Math.round(sum / this.studentGrades.length);
  }
}
