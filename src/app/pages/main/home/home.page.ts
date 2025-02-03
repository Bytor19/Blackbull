import { Component, OnInit, inject } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { orderBy } from 'firebase/firestore';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  products: Product[] = [];
  loading: boolean = false;

  ngOnInit() {}

  ionViewWillEnter() {
    // Primero verificamos si el usuario en localStorage existe y es 'admin'
    const user = this.utilsSvc.getFromLocalStorage('user') as User;

    if (!user || user.name !== 'admin') {
      // Si no existe el usuario o no es admin, redirigimos (o podrías mostrar otra vista)
      this.utilsSvc.routerLink('/main/catalog');
      return;
    }

    // Si sí es admin, cargamos los productos
    this.getProducts();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getProducts();
      event.target.complete();
    }, 1000);
  }

  // ====== Obtener ganancias ======
  getProfits() {
    return this.products.reduce((total, product) => total + (product.price * (product.soldUnits || 0)), 0);
  }

  // ====== Obtener productos desde Firebase ======
  getProducts() {
    const path = `products`;

    this.loading = true;

    const query = [
      orderBy('createdAt', 'desc'),
    ];

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        console.log('Productos obtenidos:', res);
        this.products = res;
        this.loading = false;
        sub.unsubscribe();
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
        this.loading = false;
      },
    });
  }

  // ====== Agregar o actualizar producto ======
  async addUpdateProduct(product?: Product) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product }
    });

    if (success) {
      this.getProducts(); // Refrescar productos después de agregar/editar
    }
  }

  // ====== Confirmar eliminación del producto ======
  async confirmDeleteProduct(product: Product) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Producto',
      message: '¿Quieres eliminar este producto?',
      mode: 'ios',
      buttons: [
        { text: 'Cancelar' },
        {
          text: 'Sí, eliminar',
          handler: () => {
            this.deleteProduct(product);
          },
        },
      ],
    });
  }

  // ====== Eliminar producto de Firebase ======
  async deleteProduct(product: Product) {
    const path = `products/${product.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      // Si el producto tiene imagen, eliminarla de Firebase Storage
      if (product.image) {
        let imagePath = await this.firebaseSvc.getFilePath(product.image);
        await this.firebaseSvc.deleteFile(imagePath);
      }

      await this.firebaseSvc.deleteDocument(path);
      
      // Eliminar de la lista local
      this.products = this.products.filter(p => p.id !== product.id);

      this.utilsSvc.presentToast({
        message: 'Producto eliminado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });

    } catch (error) {
      console.error('Error al eliminar producto:', error);
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      });

    } finally {
      loading.dismiss();
    }
  }
}
