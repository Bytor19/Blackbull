import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
  standalone: true, // Asegúrate de que el componente sea standalone
  imports: [IonicModule, CommonModule],
})
export class ForgotpasswordPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
