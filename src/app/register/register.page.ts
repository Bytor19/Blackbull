import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service'; // Importa el servicio de autenticación

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule], // Importar módulos necesarios
})
export class RegisterPage {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private router: Router,
    private popoverController: PopoverController,
    private authService: AuthService // Inyecta el servicio de autenticación
  ) {}

  async onSubmit() {
    const validationMessage = this.validateForm();
    if (validationMessage) {
      // Mostrar mensaje de error en un pop-up
      await this.showPopover(validationMessage);
      return;
    }

    try {
      // Registrar al usuario con Firebase
      await this.authService.register(this.email, this.password);
      console.log('Registro exitoso');
      this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
    } catch (error) {
      console.error('Error en el registro:', error);
      const message = this.getFirebaseErrorMessage(error);
      this.showPopover(message); // Mostrar mensaje de error de Firebase
    }
  }

  // Validar el formulario
  validateForm(): string | null {
    if (!this.username) {
      return 'El nombre de usuario es obligatorio.';
    }
    if (!this.email) {
      return 'El correo electrónico es obligatorio.';
    }
    if (!this.isValidEmail(this.email)) {
      return 'El correo electrónico no tiene un formato válido.';
    }
    if (!this.password) {
      return 'La contraseña es obligatoria.';
    }
    if (!this.isValidPassword(this.password)) {
      return 'La contraseña debe tener al menos 6 caracteres y contener una letra mayúscula.';
    }
    if (this.password !== this.confirmPassword) {
      return 'Las contraseñas no coinciden.';
    }
    return null; // No hay errores
  }

  // Validar el formato del correo electrónico
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // Validar la contraseña
  isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Z]).{6,}$/;
    return passwordRegex.test(password);
  }

  // Obtener mensajes de error específicos de Firebase
  getFirebaseErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'El correo electrónico ya está en uso.';
      case 'auth/invalid-email':
        return 'El correo electrónico no es válido.';
      case 'auth/weak-password':
        return 'La contraseña es demasiado débil.';
      default:
        return 'Error en el registro. Inténtalo de nuevo.';
    }
  }

  // Mostrar un popover con el mensaje de error
  async showPopover(message: string) {
    const popover = await this.popoverController.create({
      component: PopoverContentComponent,
      componentProps: { message },
      translucent: true,
      cssClass: 'custom-popover',
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
        padding: 20px;
        color: red;
        font-size: 16px;
      }
      ion-button {
        margin-top: 10px;
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