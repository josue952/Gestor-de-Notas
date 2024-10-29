import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { UsersService } from '../services/users.service';

interface Usuario {
  id_usuario?: number;
  username: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  password?: string;
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  usuarios: Usuario[] = [];
  paginatedUsuarios: Usuario[] = [];
  modalAbierto = false;
  filtroTexto: string = '';
  filtroRol: string = '';
  usuarioActual: Usuario = {
    id_usuario: 0,
    username: "",
    nombre: "",
    apellido: "",
    email: "",
    rol: "",
    password: ""
  };

  private passwordAnterior: string = "";
  paginaActual: number = 1;
  usuariosPorPagina: number = 5;
  totalPaginas: number = 0;

  constructor(
    private usersService: UsersService,
    private modalController: ModalController,
    private alertController: AlertController,
  ) {this.aplicarFiltro();}

  aplicarFiltro() {
    this.paginaActual = 1; // Resetea a la primera página al aplicar filtro
    const usuariosFiltrados = this.usuarios.filter(usuario => {
      const coincideNombreUsuario = usuario.username.toLowerCase().includes(this.filtroTexto.toLowerCase());
      const coincideNombre = usuario.nombre.toLowerCase().includes(this.filtroTexto.toLowerCase());
      const coincideApellido = usuario.apellido.toLowerCase().includes(this.filtroTexto.toLowerCase());
      const coincideRol = this.filtroRol ? usuario.rol === this.filtroRol : true;

      return (coincideNombreUsuario || coincideNombre || coincideApellido) && coincideRol;
    });

    this.paginatedUsuarios = this.paginarUsuarios(usuariosFiltrados);
  }

  paginarUsuarios(usuarios: any[]) {
    const totalPaginas = Math.ceil(usuarios.length / this.usuariosPorPagina);
    this.totalPaginas = totalPaginas;

    const inicio = (this.paginaActual - 1) * this.usuariosPorPagina;
    return usuarios.slice(inicio, inicio + this.usuariosPorPagina);
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cerrarModal();
  }

  async cargarUsuarios() {
    try {
      this.usuarios = await this.usersService.getUsers();
      console.log('Usuarios cargados:', this.usuarios);
      this.totalPaginas = Math.ceil(this.usuarios.length / this.usuariosPorPagina);
      this.actualizarPaginacion();
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      this.mostrarAlertaError('Error al cargar usuarios. Inténtelo de nuevo más tarde.');
    }
  }

  actualizarPaginacion() {
    const inicio = (this.paginaActual - 1) * this.usuariosPorPagina;
    this.paginatedUsuarios = this.usuarios.slice(inicio, inicio + this.usuariosPorPagina);
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.actualizarPaginacion();
  }

  abrirModal(usuario?: Usuario) {
    this.modalAbierto = true;
    if (usuario) {
      this.usuarioActual = { ...usuario, password: "" };
      this.passwordAnterior = usuario.password || "";
    } else {
      this.usuarioActual = {
        id_usuario: 0,
        username: "",
        nombre: "",
        apellido: "",
        email: "",
        rol: "",
        password: ""
      };
      this.passwordAnterior = "";
    }
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  async guardarUsuario() {
    try {
      if (!this.usuarioActual.id_usuario && (!this.usuarioActual.password || this.usuarioActual.password.length < 6)) {
        this.mostrarAlertaError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }

      if (this.usuarioActual.id_usuario && !this.usuarioActual.password) {
        this.usuarioActual.password = this.passwordAnterior;
      }

      if (this.usuarioActual.id_usuario) {
        await this.usersService.updateUser(this.usuarioActual.id_usuario, this.usuarioActual);
      } else {
        await this.usersService.createUser(this.usuarioActual);
      }

      this.cerrarModal();
      await this.cargarUsuarios(); // Asegúrate de recargar la lista de usuarios
    } catch (error: any) {
      console.error('Error al procesar el usuario:', error);
      let mensajeError = 'Por favor, revise los datos e intente nuevamente.';

      if (error?.status === 'validation_failed' && error.errors) {
        mensajeError = Object.values(error.errors).map((err: any) => err[0]).join(', ');
      }

      this.mostrarAlertaError('Error al procesar el usuario. ' + mensajeError);
    }
  }

  async mostrarAlertaError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  async eliminarUsuario(id?: number) {
    if (id === undefined) {
      console.error('El ID del usuario no está definido');
      return; // O maneja el error de otra forma
    }
  
    // Mostrar alerta de confirmación
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Está seguro de que desea eliminar este usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.usersService.deleteUser(id);
              await this.cargarUsuarios(); // Recargar la lista de usuarios
  
              // Verifica si hay usuarios en la página actual
              if (this.paginatedUsuarios.length === 0 && this.paginaActual > 1) {
                this.paginaActual--; // Decrementa la página actual si no hay usuarios
                await this.actualizarPaginacion(); // Actualiza la paginación
              }
            } catch (error) {
              console.error('Error al eliminar usuario:', error);
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
}
