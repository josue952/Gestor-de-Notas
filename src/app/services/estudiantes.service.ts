import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {

  private apiUrl = 'http://localhost:8000/api/estudiantes';

  constructor() {}

  // Crear un estudiante con manejo específico de errores de validación
  async createEstudiante(userData: any) {
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
        console.error('Error desconocido al crear el estudiante:', error);
        throw new Error('Error desconocido, por favor intente nuevamente más tarde.');
      }
    }
  }

  // Obtener todas las maeerias
  async getEstudiantes() {
    try {
      const response = await axios.get(this.apiUrl);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los estudiantes:', error);
      throw error;
    }
  }

  // Obtener una estudiante por ID
  async getEstudiante(id: number) {
    try {
      const response = await axios.get(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el estudiante en API:', error);
      throw error;
    }
  }

  // Obtener estudiantes no registrados 
  async getEstudiantesNoRegistrados() {
    try {
      const response = await axios.get(`${this.apiUrl}/usuario/alumnosSinRegistrar`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los alumnos no registrados:', error);
      throw error;
    }
  }

  // Actualizar mateira
  async updateEstudiante(id: number, estudiante: any) {
    const updatedData = {
        usuario_id: estudiante.usuario.id_usuario, // Asegúrate de extraer el id_usuario correctamente
        grado_id: estudiante.grado_id,
    };

    try {
        const response = await axios.put(`${this.apiUrl}/${id}`, updatedData);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 400) {
            const validationErrors = axiosError.response.data;
            console.error('Errores de validación:', validationErrors);
            throw validationErrors; 
        } else {
            console.error('Error desconocido al editar el estudiante:', error);
            throw new Error('Error desconocido, por favor intente nuevamente más tarde.');
        }
    }
}

  // Eliminar estudiante
  async deleteEstudiante(id: number) {
    try {
      const response = await axios.delete(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar el estudiante:', error);
      throw error;
    }
  }
}
