import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Pages
import { SupplierComponent } from './pages/supplier/supplier.component';
import { AddShoppingComponent } from './pages/supplier/dialog/add.shopping/add.shopping.component';

const routes: Routes = [
    { path: 'register', component: SupplierComponent, title: 'Compras', data: {breadcrumb: 'Compras/Gestión'} },
    { path: 'register/add', component: AddShoppingComponent, title: 'Proceso de creación', data: {breadcrumb: 'Compras/Registro'} },
    { path: '**', redirectTo: 'register' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingRouting { }