import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router'; // Importa Router

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent {
  userName: string = 'Nombre del Usuario'; // Asigna el nombre del usuario aquí
  userEmail: string = 'usuario@ejemplo.com'; // Asigna el email del usuario aquí

  constructor(
    private alertController: AlertController,
    private router: Router // Inyecta el Router
  ) {}

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmar Cierre de Sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      cssClass: 'alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
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
    //remover el auth_token del localStorage
    localStorage.removeItem('auth_token');
    
    this.router.navigate(['/login']); // Reemplaza '/login' con la ruta correcta a tu página de login
  }
}
