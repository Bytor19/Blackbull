import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router'; // 👈 Importamos Router
import { UtilsService } from 'src/app/services/utils.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() title!: string;
  @Input() backButton!: string;
  @Input() isModal!: boolean;
  @Input() showMenu!: boolean;

  utilsSvc = inject(UtilsService);
  cartSvc = inject(CartService);
  router = inject(Router); // 👈 Inyectamos el Router
  cartCount: number = 0;

  ngOnInit() {
    this.cartSvc.getCart().subscribe(cart => {
      this.cartCount = cart.reduce((total, product) => total + (product.soldUnits || 1), 0);
    });
  }
  
}
