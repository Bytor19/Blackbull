import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
      { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule) },
      { path: 'catalog', loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogPageModule) }, 
      { path: 'product-detail/:id', loadChildren: () => import('./product-detail/product-detail.module').then(m => m.ProductDetailPageModule) },
      { path: 'cart', loadChildren: () => import('./cart/cart.module').then(m => m.CartPageModule) }, 
    ]
  },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule { }
