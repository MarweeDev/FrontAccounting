import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

import { NeworderComponent } from './pages/neworder/neworder.component';
import { RegisterComponent } from './components/NewOrder/register/register.component';
import { ExportOrderComponent } from './components/NewOrder/register/dialog/export/export-order.component';
import { DetailsComponent } from './components/NewOrder/register/dialog/details/details.component';
import { PayorderComponent } from './components/NewOrder/payorder/payorder.component';
import { OrderComponent } from './components/NewOrder/order/order.component';
import { AddOrderComponent } from './components/NewOrder/order/dialog/add/add.order.component';
import { EditOrderComponent } from './components/NewOrder/order/dialog/edit/edit.order.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard], title: 'Registros de órdenes', data: { breadcrumb: 'Ventas/Órdenes' } },
  { path: 'register/export', component: ExportOrderComponent, canActivate: [AuthGuard], title: 'Exportar órdenes', data: { breadcrumb: 'Ventas/Órdenes/Exportar' } },
  { path: 'register/details/:id', component: DetailsComponent, canActivate: [AuthGuard], title: 'Consultando orden', data: { breadcrumb: '' } },
  { path: 'order', component: OrderComponent, canActivate: [AuthGuard], title: 'Generando orden', data: { breadcrumb: 'Ventas/Órdenes/Registro' } },
  { path: 'order/add', component: AddOrderComponent, canActivate: [AuthGuard], title: 'Crear producto', data: { breadcrumb: 'Ventas/Productos/Creación' } },
  { path: 'order/edit/:id', component: EditOrderComponent, canActivate: [AuthGuard], title: 'Editar orden', data: { breadcrumb: '' } },
  { path: 'product/edit/:id', component: AddOrderComponent, canActivate: [AuthGuard], title: 'Editar producto', data: { breadcrumb: 'Ventas/Productos/Edición' } },
  { path: 'payments/:id', component: PayorderComponent, canActivate: [AuthGuard], title: 'Realizando pago', data: { breadcrumb: 'Ventas/Órdenes/Pago' } },
  { path: '**', redirectTo: 'register' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRouting { }
