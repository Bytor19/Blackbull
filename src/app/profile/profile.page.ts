import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true, // Asegúrate de que el componente sea standalone
  imports: [IonicModule, CommonModule],
})
export class ProfilePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
