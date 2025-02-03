import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {
  @Input() product: Product;

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl(null, [Validators.required, Validators.min(0)]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');

    // Corregido: Usamos `patchValue()` en lugar de `setValue()` para evitar errores con campos opcionales
    if (this.product) {
      this.form.patchValue({
        id: this.product.id || '',
        image: this.product.image || '',
        name: this.product.name || '',
        price: this.product.price || 0,
        soldUnits: this.product.soldUnits || 0
      });
    }
  }

  // ======== Seleccionar Imagen =======
  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del Producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {
      this.setNumberInputs(); // Asegurar conversión de números antes de enviar
      if (this.product) this.updateProduct();
      else this.createProduct();
    }
  }

  // ======== Conversión de valores a número =======
  setNumberInputs() {
    let { soldUnits, price } = this.form.controls;
    if (soldUnits.value) soldUnits.setValue(parseFloat(soldUnits.value));
    if (price.value) price.setValue(parseFloat(price.value));
  }

  // ======== Crear Producto =======
  async createProduct() {
    const path = `products`; // Cambiado: Se guardan en "products" y no en "users/{uid}/products"

    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      // Subir imagen a Firebase Storage y obtener la URL
      const dataUrl = this.form.value.image;
      const imagePath = `${this.user.uid}/${Date.now()}`;
      const imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);

      const newProduct = {
        ...this.form.value,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await this.firebaseSvc.addDocument(path, newProduct);
      
      this.utilsSvc.dismissModal({ success: true });

      this.utilsSvc.presentToast({
        message: 'Producto creado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });

    } catch (error) {
      console.error('Error al crear producto:', error);
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

  // ======== Actualizar Producto =======
  async updateProduct() {
    const path = `products/${this.product.id}`; // Cambiado: Se usa "products/" en lugar de "users/{uid}/products/"

    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      // Si la imagen cambió, subir la nueva a Firebase Storage
      if (this.form.value.image !== this.product.image) {
        const dataUrl = this.form.value.image;
        const oldImagePath = await this.firebaseSvc.getFilePath(this.product.image);
        const newImageUrl = await this.firebaseSvc.uploadImage(oldImagePath, dataUrl);
        this.form.controls.image.setValue(newImageUrl);
      }

      const updatedProduct = {
        ...this.form.value,
        updatedAt: Date.now(),
      };

      await this.firebaseSvc.updateDocument(path, updatedProduct);
      
      this.utilsSvc.dismissModal({ success: true });

      this.utilsSvc.presentToast({
        message: 'Producto actualizado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });

    } catch (error) {
      console.error('Error al actualizar producto:', error);
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
