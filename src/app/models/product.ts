export class Product {
}
export interface Product {
    id?: string; // El ID es opcional porque Firestore lo genera automáticamente
    name: string;
    description: string;
    price: number;
    image: string;
  }