import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { orderBy } from 'firebase/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.page.html',
  styleUrls: ['./catalog.page.scss'],
})
export class CatalogPage implements OnInit, OnDestroy {
  firebaseSvc = inject(FirebaseService);
  router = inject(Router);
  products: Product[] = [];
  loading = true;
  private productSubscription: Subscription;

  ngOnInit() {
    this.getProducts();
  }

  // Obtener productos desde Firebase
  getProducts() {
    const path = `products`;

    const query = [orderBy('createdAt', 'desc')];

    this.productSubscription = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        this.products = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
        this.loading = false;
      },
    });
  }

  // Liberar la suscripción cuando se destruye el componente
  ngOnDestroy() {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

  // Navegar a la página de detalles del producto
  viewProduct(product: Product) {
    this.router.navigate(['/main/product-detail', product.id]); // 👈 Navega pasando el ID del producto
  }
}
