import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = 'http://localhost:8000/api/users'; // Cambia la URL base según tu configuración

  constructor() {}

  // Crear usuario
  async createUser(userData: any) {
    try {
      const response = await axios.post(this.apiUrl, userData);
      return response.data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  // Obtener todos los usuarios
  async getUsers() {
    try {
      const response = await axios.get(this.apiUrl);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  // Obtener un usuario por ID o email
  async getUser(idOrEmail: string | number) {
    try {
      const response = await axios.get(`${this.apiUrl}/${idOrEmail}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  }

  // Actualizar usuario
  async updateUser(id: number, updatedData: any) {
    try {
      const response = await axios.put(`${this.apiUrl}/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }

  // Eliminar usuario
  async deleteUser(id: number) {
    try {
      const response = await axios.delete(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }
}
