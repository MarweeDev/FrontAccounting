import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Pages
import { NeworderComponent } from './pages/neworder/neworder.component';

//Register
import { RegisterComponent } from './components/NewOrder/register/register.component';
import { ExportOrderComponent } from './components/NewOrder/register/dialog/export/export-order.component';
import { DetailsComponent } from './components/NewOrder/register/dialog/details/details.component';

//Pay
import { PayorderComponent } from './components/NewOrder/payorder/payorder.component';

//order
import { OrderComponent } from './components/NewOrder/order/order.component';
import { AddOrderComponent } from './components/NewOrder/order/dialog/add/add.order.component';
import { EditOrderComponent } from './components/NewOrder/order/dialog/edit/edit.order.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
    //register
    { path: 'neworder/register', component: RegisterComponent, canActivate: [AuthGuard], title: 'Registros de ordenes', data: {breadcrumb: 'Ventas/Ordenes'} },
    { path: 'neworder/register/export', component: ExportOrderComponent, canActivate: [AuthGuard], title: 'Registros de ordenes exportar', data: {breadcrumb: 'Ventas/Ordenes/Exportar'} },
    { path: 'neworder/register/details/:id', component: DetailsComponent, canActivate: [AuthGuard], title: 'Consultando orden', data: {breadcrumb: ''} },

    //order
    { path: 'neworder/order', component: OrderComponent, canActivate: [AuthGuard], title: 'Generando orden', data: {breadcrumb: 'Ventas/Ordenes/Registro'} },
    { path: 'neworder/order/add', component: AddOrderComponent, canActivate: [AuthGuard], title: 'Proceso de creación', data: {breadcrumb: ''} },
    { path: 'neworder/order/edit/:id', component: EditOrderComponent, canActivate: [AuthGuard], title: 'Proceso de edición', data: {breadcrumb: ''} },

    //pay
    { path: 'neworder/payments/:id', component: PayorderComponent, canActivate: [AuthGuard], title: 'Realizando pago', data: {breadcrumb: 'Ventas/Ordenes/Pago'} },
    { path: '**', redirectTo: 'authorization/login' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRouting { }