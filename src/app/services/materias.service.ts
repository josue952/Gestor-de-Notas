import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class MateriasService {

  private apiUrl = 'http://localhost:8000/api/materias';

  constructor() {}

  // Crear un materia con manejo específico de errores de validación
  async createMateria(userData: any) {
    try {
      const response = await axios.post(this.apiUrl, userData);
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
        console.error('Error desconocido al crear la materia:', error);
        throw new Error('Error desconocido, por favor intente nuevamente más tarde.');
      }
    }
  }

  // Obtener todas las maeerias
  async getMaterias() {
    try {
      const response = await axios.get(this.apiUrl);
      return response.data;
    } catch (error) {
      console.error('Error al obtener las materias:', error);
      throw error;
    }
  }

  // Obtener una materia por ID
  async getMateria(id: number) {
    try {
      const response = await axios.get(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la materia:', error);
      throw error;
    }
  }

  // Actualizar mateira
  async updateMateria(id: number, updatedData: any) {
    try {
      const response = await axios.put(`${this.apiUrl}/${id}`, updatedData);
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
        console.error('Error desconocido al editar la materia:', error);
        throw new Error('Error desconocido, por favor intente nuevamente más tarde.');
      }
    }
  }

  // Eliminar materia
  async deleteMateria(id: number) {
    try {
      const response = await axios.delete(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar la materia:', error);
      throw error;
    }
  }
}
