import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // Redirige a 'login' en lugar de 'home'
    pathMatch: 'full',
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminPageModule),
    canActivate: [AuthGuard], // Protege esta ruta
  },
  {
    path: 'catalog',
    loadChildren: () => import('./catalog/catalog.module').then((m) => m.CatalogPageModule),
    canActivate: [AuthGuard], // Protege esta ruta
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then((m) => m.LoginPageModule),
    // No protejas esta ruta con AuthGuard
  },
  {
    path: 'product-detail/:id', // Añade un parámetro dinámico para el ID del producto
    loadChildren: () =>
      import('./product-detail/product-detail.module').then((m) => m.ProductDetailPageModule),
    canActivate: [AuthGuard], // Protege esta ruta
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then((m) => m.ProfilePageModule),
    canActivate: [AuthGuard], // Protege esta ruta
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then((m) => m.RegisterPageModule),
    // No protejas esta ruta con AuthGuard
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then((m) => m.ProductsPageModule),
    canActivate: [AuthGuard], // Protege esta ruta
  },
  {
    path: 'forgotpassword',
    loadChildren: () =>
      import('./forgotpassword/forgotpassword.module').then((m) => m.ForgotpasswordPageModule),
    // No protejas esta ruta con AuthGuard
  },
  {
    path: '**', // Ruta comodín para manejar rutas no encontradas
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
