import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class GradosMateriasService {

  private apiUrl = 'http://localhost:8000/api/grados'; // Cambia la URL base según tu configuración

  constructor() {}

  // Crear un grado-materia con manejo específico de errores de validación
  async createGradoMateria(id: number, userData: any) {
    try {
      const response = await axios.post(`${this.apiUrl}/${id}/materias`, userData);
      return response.data;
    } catch (error) {
      // Usar 'as AxiosError' para especificar el tipo de error
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 400) {
        // Captura los errores de validación específicos
        const validationErrors = axiosError.response.data;
        console.error('Errores de validación:', validationErrors);
        throw validationErrors; // Lanza los errores para que puedan manejarse en el componente
      } else {
        console.error('Error desconocido al agregar una materia al grado:', error);
        throw new Error('Error desconocido, por favor intente nuevamente más tarde.');
      }
    }
  }

  // Obtener todas las materias
  async getGradoMaterias(id: number) {
    try {
      const response = await axios.get(`${this.apiUrl}/${id}/materias`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener las materias del grado:', error);
      throw error;
    }
  }

  // Obtener todas las materias de un grado en específico
  async getGradoMateria(id: number) {
    try {
      const response = await axios.get(`${this.apiUrl}/${id}/materias/0`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la materia del grado:', error);
      throw error;
    }
  }

  // Eliminar grado
  async deleteGradoMaterias(id: number, id_materia: number) {
    try {
      const response = await axios.delete(`${this.apiUrl}/${id}/materias/${id_materia}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar el grado:', error);
      throw error;
    }
  }
}
