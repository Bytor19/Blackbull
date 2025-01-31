import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  standalone: true, // Asegúrate de que el componente sea standalone
  imports: [IonicModule, CommonModule],
})
export class ProductDetailPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
