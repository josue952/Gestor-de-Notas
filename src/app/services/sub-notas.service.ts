import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class SubNotasService {

  private apiUrl = 'http://localhost:8000/api/calificaciones';

  constructor() {}

  // Crear un sub-nota con manejo específico de errores de validación
  async createSubNota( id: number, userData: any) {
    try {
      const response = await axios.post(`${this.apiUrl}/${id}/subnotas`, userData);
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
        console.error('Error desconocido al crear la sub-nota:', error);
        throw new Error('Error desconocido, por favor intente nuevamente más tarde.');
      }
    }
  }

  // Obtener todas las sub-notas de una nota o calificación
  async getSubNotas(id: number) {
    try {
      const response = await axios.get(`${this.apiUrl}/${id}/subnotas`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener las sub-notas:', error);
      throw error;
    }
  }


  // Actualizar una sub-nota
  async updateNota(id: number, updatedData: any) {
    try {
      const response = await axios.put(`${this.apiUrl}/${id}/subnotas`, updatedData);
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
        console.error('Error desconocido al editar la sub-nota:', error);
        throw new Error('Error desconocido, por favor intente nuevamente más tarde.');
      }
    }
  }

  // Eliminar una nota (Cambiar el valor de todas las subnotas de una calificación a 0)
  async deleteSubNotas(id: number) {
    try {
      const response = await axios.delete(`${this.apiUrl}/${id}/subnotas`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar las sub-notas:', error);
      throw error;
    }
  }

  // Eliminar una nota (Cambiar el valor de todas las subnotas de una calificación a 0)
  async deleteSubNota(id: number, id_sub_nota: number) {
    try {
      const response = await axios.delete(`${this.apiUrl}/${id}/subnotas/${id_sub_nota}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar la sub-nota:', error);
      throw error;
    }
  }
}
