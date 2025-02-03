import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { CartService } from 'src/app/services/cart.service';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  cartSvc = inject(CartService);
  route = inject(ActivatedRoute);

  product: Product = null;
  loading = true;

  ngOnInit() {
    this.getProduct();
  }

  async getProduct() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (!productId) return;

    try {
      const productData = await this.firebaseSvc.getDocument(`products/${productId}`);
      this.product = productData as Product;
    } catch (error) {
      console.error('Error al obtener producto:', error);
    } finally {
      this.loading = false;
    }
  }

  // Agregar producto al carrito
  addToCart() {
    if (this.product) {
      this.cartSvc.addToCart(this.product);
    }
  }
}
