import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Pages
import { SupplierComponent } from './pages/supplier/supplier.component';
import { AddShoppingComponent } from './pages/supplier/dialog/add.shopping/add.shopping.component';
import { NewShoppingComponent } from './pages/new-shopping/new-shopping.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
    { path: 'register', component: SupplierComponent, canActivate: [AuthGuard], title: 'Compras', data: {breadcrumb: 'Compras/Gestión'} },
    { path: 'register/add', component: AddShoppingComponent,  canActivate: [AuthGuard], title: 'Proceso de creación', data: {breadcrumb: 'Compras/Proveedores'} },
    
    { path: 'register/NewShopping', component: NewShoppingComponent, canActivate: [AuthGuard], title: 'Nueva Compra', data: {breadcrumb: 'Compras/Registro'} },
    { path: '**', redirectTo: 'register' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingRouting { }