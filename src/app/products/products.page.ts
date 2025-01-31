import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ProductsPage {
  products: any[] = [];
  newProduct: any = {
    name: '',
    description: '',
    price: 0, // Cambiado de null a 0
    image: null,
  };
  loading: boolean = false;
  toastMessage: string | null = null;

  constructor(
    private firestore: Firestore,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  async addProduct() {
    if (this.newProduct.name && this.newProduct.description && this.newProduct.price !== null && this.newProduct.image) {
      this.loading = true;

      try {
        const productsCollection = collection(this.firestore, 'products');
        await addDoc(productsCollection, { ...this.newProduct });

        this.products.push({ ...this.newProduct });

        this.newProduct = {
          name: '',
          description: '',
          price: 0, // Cambiado de null a 0
          image: null,
        };

        this.showToast('Product saved successfully!');
      } catch (error) {
        console.error('Error saving product:', error);
        this.showToast('Error saving product. Please try again.');
      } finally {
        this.loading = false;
      }
    } else {
      this.showToast('Please fill in all fields!');
    }
  }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    });

    if (image.webPath) {
      this.newProduct.image = image.webPath;
    }
  }

  deleteProduct(index: number) {
    this.products.splice(index, 1);
  }

  private async showToast(message: string) {
    this.toastMessage = message;
    const toast = await this.toastController.create({
      message: this.toastMessage,
      duration: 3000,
      position: 'bottom',
    });
    toast.present();
    toast.onDidDismiss().then(() => {
      this.toastMessage = null;
    });
  }
}