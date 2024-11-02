import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';

@Injectable({
  providedIn: 'root',
})
export class NotasService {
  private apiUrl = 'http://localhost:8000/api/calificaciones';

  constructor() {}

  // Crear un nota con manejo específico de errores de validación
  async createNota(userData: any) {
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
        console.error('Error desconocido al crear la nota:', error);
        throw new Error('Error desconocido, por favor intente nuevamente más tarde.');
      }
    }
  }

  // Obtener todas una nota por su id
  async getNotas(id: number) {
    try {
      const response = await axios.get(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener las notas:', error);
      throw error;
    }
  }

  // Obtener una nota por el carnet del estudiante
  async getNota(id: number) {
    try {
      const response = await axios.get(`${this.apiUrl}/estudiante/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la nota:', error);
      throw error;
    }
  }

  // Actualizar una nota
  async updateNota(id: number, updatedData: any) {
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
        console.error('Error desconocido al editar la nota:', error);
        throw new Error('Error desconocido, por favor intente nuevamente más tarde.');
      }
    }
  }

  // Eliminar una nota
  async deleteNota(id: number) {
    try {
      const response = await axios.delete(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
      throw error;
    }
  }
}
