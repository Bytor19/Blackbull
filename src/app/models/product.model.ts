export interface Product {
    id?: string;          // ID único generado por Firebase
    name: string;         // Nombre del producto
    description?: string; // Descripción del producto (opcional)
    price: number;        // Precio del producto
    image?: string;       // URL de la imagen del producto
    soldUnits?: number;   // Unidades vendidas
    createdAt?: number;   // Timestamp de creación
    updatedAt?: number;   // Timestamp de última actualización
  }
  