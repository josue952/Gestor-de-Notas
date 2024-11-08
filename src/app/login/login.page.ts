import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService, // Inyectamos el servicio de autenticación
    private router: Router,           // Inyectamos el enrutador para redirigir
    private alertController: AlertController // Inyectamos el controlador de alertas
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Cualquier lógica de inicialización adicional
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
  
      // Llamamos al servicio de autenticación y manejamos la promesa con then/catch
      this.authService.login(email, password)
        .then(async (response: any) => {
          console.log('Login exitoso', response);
  
          // Guardamos el token y el correo en el localStorage
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('email', email); // Guardar el correo en localStorage
  
          // Redirigir al dashboard
          this.router.navigate(['/usuarios']);
        })
        .catch(async (error: any) => {
          console.error('Error en login', error);
  
          // Mostrar alerta de error
          const alert = await this.alertController.create({
            header: 'Error al iniciar sesion',
            message: 'Correo o contraseña incorrecta.',
            buttons: ['OK']
          });
          await alert.present();
        });
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
