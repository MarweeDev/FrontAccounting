import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { AddShoppingComponent } from './pages/supplier/dialog/add.shopping/add.shopping.component';
import { DetailShoppingComponent } from './pages/detail-shopping/detail-shopping.component';
import { EditShoppingComponent } from './pages/edit-shopping/edit-shopping.component';
import { NewShoppingComponent } from './pages/new-shopping/new-shopping.component';
import { ViewShoppingComponent } from './pages/view-shopping/view-shopping.component';

const routes: Routes = [
  { path: 'register', component: ViewShoppingComponent, canActivate: [AuthGuard], title: 'Compras', data: { breadcrumb: 'Compras/Gestión' } },
  { path: 'register/add', component: NewShoppingComponent, canActivate: [AuthGuard], title: 'Nueva compra', data: { breadcrumb: 'Compras/Registro' } },
  { path: 'register/edit/:id', component: EditShoppingComponent, canActivate: [AuthGuard], title: 'Editar compra', data: { breadcrumb: 'Compras/Edición' } },
  { path: 'register/detail/:id', component: DetailShoppingComponent, canActivate: [AuthGuard], title: 'Detalle compra', data: { breadcrumb: 'Compras/Detalle' } },
  { path: 'suppliers/add', component: AddShoppingComponent, canActivate: [AuthGuard], title: 'Nuevo proveedor', data: { breadcrumb: 'Compras/Proveedores' } },
  { path: '**', redirectTo: 'register' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingRouting { }
