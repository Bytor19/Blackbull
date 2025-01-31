import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.page.html',
  styleUrls: ['./catalog.page.scss'],
  standalone: true, // Asegúrate de que el componente sea standalone
  imports: [IonicModule, CommonModule],
})
export class CatalogPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
