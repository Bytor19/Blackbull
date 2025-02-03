import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Product[] = [];
  private cartSubject = new BehaviorSubject<Product[]>([]);
  private userId: string = '';

  constructor(private utilsSvc: UtilsService) {
    this.loadUser();
    this.loadCart();
  }

  // Obtener el usuario actual
  private loadUser() {
    const user = this.utilsSvc.getFromLocalStorage('user');
    if (user?.uid) {
      this.userId = user.uid;
    }
  }

  // Obtener el carrito en tiempo real
  getCart() {
    return this.cartSubject.asObservable();
  }

  // Agregar un producto al carrito
  addToCart(product: Product) {
    if (!this.userId) return; // Evitar agregar si no hay usuario autenticado

    const existingProduct = this.cart.find(p => p.id === product.id);
    if (existingProduct) {
      existingProduct.soldUnits = (existingProduct.soldUnits || 0) + 1;
    } else {
      this.cart.push({ ...product, soldUnits: 1 });
    }
    this.updateCart();
  }

  // Eliminar un producto del carrito
  removeFromCart(productId: string) {
    this.cart = this.cart.filter(p => p.id !== productId);
    this.updateCart();
  }

  // Modificar cantidad de un producto
  updateQuantity(productId: string, quantity: number) {
    const product = this.cart.find(p => p.id === productId);
    if (product) {
      product.soldUnits = Math.max(0, quantity);
      if (product.soldUnits === 0) {
        this.removeFromCart(productId);
      } else {
        this.updateCart();
      }
    }
  }

  // Obtener el total del carrito
  getTotalPrice(): number {
    return this.cart.reduce((total, product) => total + (product.price * (product.soldUnits || 1)), 0);
  }

  // Guardar carrito en localStorage
  private updateCart() {
    if (this.userId) {
      localStorage.setItem(`cart_${this.userId}`, JSON.stringify(this.cart));
      this.cartSubject.next([...this.cart]); // Emitir una nueva copia del carrito
    }
  }

  // Cargar carrito desde localStorage
  private loadCart() {
    if (!this.userId) return;
    
    const savedCart = localStorage.getItem(`cart_${this.userId}`);
    this.cart = savedCart ? JSON.parse(savedCart) : [];
    this.cartSubject.next([...this.cart]);
  }

  // Vaciar el carrito
  clearCart() {
    this.cart = [];
    this.updateCart();
  }
}
