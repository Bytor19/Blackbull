import { Component, OnInit, inject } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartSvc = inject(CartService);
  cart: Product[] = [];
  total = 0;

  ngOnInit() {
    this.cartSvc.getCart().subscribe(cart => {
      this.cart = cart;
      this.total = this.cartSvc.getTotalPrice();
    });
  }

  updateQuantity(product: Product, event) {
    const newQuantity = event.detail.value;
    this.cartSvc.updateQuantity(product.id, newQuantity);
  }

  removeItem(productId: string) {
    this.cartSvc.removeFromCart(productId);
  }

  clearCart() {
    this.cartSvc.clearCart();
  }
}
