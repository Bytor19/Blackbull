import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  cartSvc = inject(CartService);
  router = inject(Router);
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  
  currentPath: string = '';
  cartCount: number = 0;

  pages = [
    { title: 'Inicio', url: '/main/home', icon: 'home-outline' },
    { title: 'Perfil', url: '/main/profile', icon: 'person-outline' },
    { title: 'Carrito', url: '/main/cart', icon: 'cart-outline' } // ✅ NUEVO: Agregamos el carrito
  ];

  ngOnInit() {
    // Detectar cambios en la ruta actual
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url;
    });

    // Suscribirse al carrito para obtener la cantidad en tiempo real
    this.cartSvc.getCart().subscribe(cart => {
      this.cartCount = cart.reduce((total, product) => total + (product.soldUnits || 1), 0);
    });
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  //====== Cerrar Sesión  =====
  signOut() {
    this.firebaseSvc.signOut();
  }
}
