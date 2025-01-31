import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../models/product'; // Asegúrate de crear este modelo

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private firestore: Firestore) { }

  // Obtener todos los productos
  getProducts(): Observable<Product[]> {
    const productsCollection = collection(this.firestore, 'products');
    return collectionData(productsCollection, { idField: 'id' }) as Observable<Product[]>;
  }

  // Agregar un nuevo producto
  addProduct(product: Product): Promise<void> {
    const productsCollection = collection(this.firestore, 'products');
    return addDoc(productsCollection, product).then(docRef => {
      console.log('Product added with ID: ', docRef.id);
    }).catch(error => {
      console.error('Error adding product: ', error);
    });
  }

  // Actualizar un producto existente
  updateProduct(product: Product): Promise<void> {
    const productDoc = doc(this.firestore, `products/${product.id}`);
    return updateDoc(productDoc, { ...product });
  }

  // Eliminar un producto
  deleteProduct(productId: string): Promise<void> {
    const productDoc = doc(this.firestore, `products/${productId}`);
    return deleteDoc(productDoc);
  }
}