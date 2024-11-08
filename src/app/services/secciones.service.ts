import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class SeccionesService {

  private apiUrl = 'http://localhost:8000/api/secciones'; // Cambia la URL base según tu configuración

  constructor() {}

  // Obtener todas las secciones
  async getSecciones() {
    try {
      const response = await axios.get(this.apiUrl);
      return response.data;
    } catch (error) {
      console.error('Error al obtener las secciones:', error);
      throw error;
    }
  }

  // Obtener una seccion por ID
  async getSeccion(id: number) {
    try {
      const response = await axios.get(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la seccion:', error);
      throw error;
    }
  }
}
