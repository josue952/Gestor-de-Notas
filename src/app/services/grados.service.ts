import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class GradosService {

  private apiUrl = 'http://localhost:8000/api/grados'; // Cambia la URL base según tu configuración

  constructor() {}

  // Crear un grado con manejo específico de errores de validación
  async createGrado(userData: any) {
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
        console.error('Error desconocido al crear el grado:', error);
        throw new Error('Error desconocido, por favor intente nuevamente más tarde.');
      }
    }
  }

  // Obtener todos los grados
  async getGrados() {
    try {
      const response = await axios.get(this.apiUrl);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los grados:', error);
      throw error;
    }
  }

  // Obtener un grado por ID
  async getGrado(id: number) {
    try {
      const response = await axios.get(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el grado:', error);
      throw error;
    }
  }

  // Actualizar grado
  async updateGrado(id: number, updatedData: any) {
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
        console.error('Error desconocido al editar el grado:', error);
        throw new Error('Error desconocido, por favor intente nuevamente más tarde.');
      }
    }
  }

  // Eliminar grado
  async deleteGrado(id: number) {
    try {
      const response = await axios.delete(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar el grado:', error);
      throw error;
    }
  }
}
