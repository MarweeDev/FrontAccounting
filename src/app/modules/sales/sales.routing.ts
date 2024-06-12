import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Pages
import { NeworderComponent } from './pages/neworder/neworder.component';

//Register
import { RegisterComponent } from './components/NewOrder/register/register.component';
import { DetailsComponent } from './components/NewOrder/register/dialog/details/details.component';

//Pay
import { PayorderComponent } from './components/NewOrder/payorder/payorder.component';

//order
import { OrderComponent } from './components/NewOrder/order/order.component';
import { AddOrderComponent } from './components/NewOrder/order/dialog/add/add.order.component';
import { EditOrderComponent } from './components/NewOrder/order/dialog/edit/edit.order.component';

const routes: Routes = [
    //register
    { path: 'neworder/register', component: RegisterComponent, title: 'Registros de ordenes', data: {breadcrumb: 'Ventas/Ordenes'} },
    { path: 'neworder/register/details/:id', component: DetailsComponent, title: 'Consultando orden', data: {breadcrumb: ''} },

    //order
    { path: 'neworder/order', component: OrderComponent, title: 'Generando orden', data: {breadcrumb: 'Ventas/Ordenes/Registro'} },
    { path: 'neworder/order/add', component: AddOrderComponent, title: 'Proceso de creación', data: {breadcrumb: ''} },
    { path: 'neworder/order/edit/:id', component: EditOrderComponent, title: 'Proceso de edición', data: {breadcrumb: ''} },

    //pay
    { path: 'neworder/payments/:id', component: PayorderComponent, title: 'Realizando pago', data: {breadcrumb: 'Ventas/Ordenes/Pago'} },
    { path: '**', redirectTo: 'authorization/login' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRouting { }