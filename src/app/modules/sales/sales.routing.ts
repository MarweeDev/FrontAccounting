import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Pages
import { NeworderComponent } from './pages/neworder/neworder.component';

//Components
import { PayorderComponent } from './components/NewOrder/payorder/payorder.component';

//order
import { OrderComponent } from './components/NewOrder/order/order.component';
import { AddOrderComponent } from './components/NewOrder/order/dialog/add/add.order.component';
import { EditOrderComponent } from './components/NewOrder/order/dialog/edit/edit.order.component';

const routes: Routes = [
    { path: 'neworder', component: NeworderComponent, title: 'Nueva orden' },

    //order
    { path: 'neworder/order', component: OrderComponent, title: 'Generando orden' },
    { path: 'neworder/order/add', component: AddOrderComponent, title: 'Proceso de creación' },
    { path: 'neworder/order/edit/:id', component: EditOrderComponent, title: 'Proceso de edición' },
    { path: 'neworder/payments/:id', component: PayorderComponent, title: 'Realizando pago' },
    { path: '**', redirectTo: 'neworder' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRouting { }