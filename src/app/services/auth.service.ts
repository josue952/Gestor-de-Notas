import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // Cambia esto por tu URL de Laravel

  constructor() { }

  async login(email: string, password: string): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/login`, { email, password });
      return response.data;
    } catch (error: any) {
      // Verificar si el error tiene una respuesta y datos
      if (error.response && error.response.data) {
        throw error.response.data;
      } else {
        // Si no tiene respuesta adecuada, lanzar un error genérico
        throw new Error('An error occurred during login');
      }
    }
  }
}
