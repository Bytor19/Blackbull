import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true, // Es standalone y no necesita ser declarado en un módulo
  imports: [IonicModule], // Importa los módulos necesarios
})
export class AdminPage {
  constructor(private router: Router) {}

  // Método para navegar a otra página
  goToPage(page: string) {
    this.router.navigate([`/${page}`]); // Redirige a la ruta especificada
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}