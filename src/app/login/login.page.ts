import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, PopoverController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private popoverController: PopoverController,
    private authService: AuthService // Inyecta el servicio de autenticación
  ) {}

  async onSubmit() {
    if (this.email === 'admin@powerbull.com' && this.password === '12345Admin') {
      this.router.navigate(['/admin']); // Redirige a la página de administrador
      return; // Detiene la ejecución del método
    }
    // Validar el formulario
    if (this.email && this.isValidEmail(this.email) && this.password) {
      try {
        // Iniciar sesión con Firebase
        await this.authService.login(this.email, this.password);
        console.log('Inicio de sesión exitoso');
        this.router.navigate(['/catalog']); // Redirige al catálogo
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        const message = this.getFirebaseErrorMessage(error);
        this.showPopover(message); // Muestra el popover con el mensaje de error
      }
    } else {
      const message = this.getErrorMessage();
      this.showPopover(message); // Muestra el popover con el mensaje de error
    }
  }

  // Validar el formato del correo electrónico
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // Obtener el mensaje de error correspondiente
  getErrorMessage(): string {
    if (!this.email) {
      return 'Por favor, introduce tu correo electrónico.';
    }
    if (!this.isValidEmail(this.email)) {
      return 'Por favor, introduce un correo válido.';
    }
    if (!this.password) {
      return 'Por favor, introduce tu contraseña.';
    }
    return '';
  }

  // Obtener mensajes de error específicos de Firebase
  getFirebaseErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'El correo electrónico no es válido.';
      case 'auth/user-disabled':
        return 'La cuenta ha sido deshabilitada.';
      case 'auth/user-not-found':
        return 'No existe una cuenta con este correo.';
      case 'auth/wrong-password':
        return 'La contraseña es incorrecta.';
      default:
        return 'Error al iniciar sesión. Inténtalo de nuevo.';
    }
  }

  // Mostrar un popover con el mensaje de error
  async showPopover(message: string) {
    const popover = await this.popoverController.create({
      component: PopoverContentComponent, // Componente que muestra el mensaje de error
      componentProps: { message },
      translucent: true,
    });
    await popover.present();
  }
}

// Componente para el contenido del popover
@Component({
  selector: 'app-popover-content',
  template: `
    <div class="popover-content">
      <p>{{ message }}</p>
      <ion-button fill="clear" size="small" (click)="dismiss()">Cerrar</ion-button>
    </div>
  `,
  styles: [
    `
      .popover-content {
        text-align: center;
        padding: 15px;
        color: red;
        font-size: 16px;
      }
    `,
  ],
  standalone: true,
  imports: [IonicModule],
})
export class PopoverContentComponent {
  message!: string;

  constructor(private popoverController: PopoverController) {}

  dismiss() {
    this.popoverController.dismiss();
  }
}