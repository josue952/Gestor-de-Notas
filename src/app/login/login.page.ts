import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private usersService: UsersService // Inyectamos el servicio de usuarios
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  async onSubmit() {
    // Obtener los valores de correo y contraseña del formulario
    const { email, password } = this.loginForm.value;
  
    if (this.loginForm.valid) {
      try {
        // Intentamos iniciar sesión
        const response: any = await this.authService.login(email, password);
        console.log('Login exitoso', response);
  
        // Guardamos el token en localStorage
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('email', email);
  
        // Obtenemos los datos del usuario incluyendo el rol
        const user = await this.usersService.getUser(email);
        const userRole = user.rol;
  
        // Guardamos el rol del usuario en localStorage para su uso futuro
        localStorage.setItem('user_role', userRole);
  
        // Validamos el rol antes de permitir el acceso
        if (userRole === 'Administrador' || userRole === 'Maestro') {
          // Redirigir al dashboard
          this.router.navigate(['/usuarios']);
        } else if (userRole === 'Estudiante') {
          // Si el rol es "Estudiante", mostrar una alerta y prevenir el acceso
          const alert = await this.alertController.create({
            header: 'Acceso Denegado',
            message: 'Los usuarios no tienen permitido accesar al sistema por el momento, vuelva más tarde.',
            buttons: ['OK']
          });
          await alert.present();
  
          // Eliminamos los datos del usuario del localStorage
          localStorage.removeItem('auth_token');
          localStorage.removeItem('email');
          localStorage.removeItem('user_role');
        }
  
      } catch (error: any) {
        console.error('Error en login', error);
  
        // Determinar el mensaje de error en base al código de respuesta
        const alertMessage = error.status === 403 && error?.message
          ? error.message
          : 'Correo o contraseña incorrecta.';
  
        // Mostrar alerta de error
        const alert = await this.alertController.create({
          header: 'Error al iniciar sesión',
          message: alertMessage,
          buttons: ['OK']
        });
        await alert.present();
      }
    } else {
      // En caso de que el formulario no sea válido, mostrar una alerta
      const alert = await this.alertController.create({
        header: 'Error al iniciar sesión',
        message: 'Por favor, complete todos los campos correctamente.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
  
  // Métodos auxiliares para acceder a los controles del formulario
  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }
}
