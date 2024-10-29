import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class NotasService {
  private apiUrl = 'http://127.0.0.1:8000/api/calificaciones';

  constructor() {}

  // Crear una nueva calificación
  async crearCalificacion(calificacionData: any): Promise<any> {
    console.log('Datos enviados:', calificacionData);
    try {
      const response = await axios.post(this.apiUrl, calificacionData);
      console.log('Respuesta de la API:', response.data); // Muestra la respuesta completa
      return response.data;
    } catch (error) {
      console.error('Error al crear la calificación:', error);
      throw error;
    }
  }

  // Obtener calificaciones de un estudiante por su ID
  async obtenerCalificacionesPorEstudiante(
    estudianteId: number
  ): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/estudiante/${estudianteId}`
      ); // Endpoint para obtener calificaciones por estudiante
      return response.data; // Suponiendo que el backend devuelva un array
    } catch (error) {
      console.error(
        'Error al obtener las calificaciones del estudiante:',
        error
      );
      throw error;
    }
  }

  // Obtener una calificación por ID
  async obtenerCalificacionPorId(idCalificacion: number): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}/${idCalificacion}`); // Endpoint para obtener una calificación por ID
      return response.data; // Suponiendo que el backend devuelva un objeto
    } catch (error) {
      console.error('Error al obtener la calificación:', error);
      throw error;
    }
  }

  // Actualizar una calificación
  async actualizarCalificacion(
    idCalificacion: number,
    calificacionData: any
  ): Promise<any> {
    try {
      const response = await axios.put(
        `${this.apiUrl}/${idCalificacion}`,
        calificacionData
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar la calificación:', error);
      throw error;
    }
  }

  // Eliminar una calificación
  async eliminarCalificacion(idCalificacion: number): Promise<any> {
    try {
      const response = await axios.delete(`${this.apiUrl}/${idCalificacion}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar la calificación:', error);
      throw error;
    }
  }
}
