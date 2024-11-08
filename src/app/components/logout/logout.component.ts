import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  userName: string | null = null; // Variable para almacenar el nombre del usuario
  userEmail = localStorage.getItem('email'); // Obtener el correo del usuario de localStorage

  constructor(
    private alertController: AlertController,
    private router: Router,
    private usersService: UsersService // Inyectar el servicio UsersService
  ) {}

  ngOnInit() {
    this.getUserName();
  }

  async getUserName() {
    if (this.userEmail) {
      try {
        const user = await this.usersService.getUser(this.userEmail); // Llama al servicio con el correo
        this.userName = user.nombre_completo; // Asigna el nombre del usuario
      } catch (error) {
        console.error('Error al obtener el nombre del usuario:', error);
      }
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmar Cierre de Sesión',
      message: `¿Estás seguro de que deseas cerrar sesión, ${this.userName}?`,
      cssClass: 'alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          },
        },
        {
          text: 'Cerrar Sesión',
          handler: () => {
            this.logout();
          },
        },
      ],
    });

    await alert.present();
  }

  logout() {
    localStorage.removeItem('auth_token'); // Remover el auth_token de localStorage
    this.router.navigate(['/login']); // Redirigir a la página de login
  }
}
