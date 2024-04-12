import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Pages
import { NeworderComponent } from './pages/neworder/neworder.component';

//Components
import { PayorderComponent } from './components/Payment/payorder/payorder.component';

//assignment
import { AddComponent } from './components/NewOrder/assignment/dialog/add/add.component';
import { EditComponent } from './components/NewOrder/assignment/dialog/edit/edit.component';
import { ReservesComponent } from './components/NewOrder/assignment/dialog/reserves/reserves.component';

//order
import { AddOrderComponent } from './components/NewOrder/order/dialog/add/add.order.component';
import { EditOrderComponent } from './components/NewOrder/order/dialog/edit/edit.order.component';

const routes: Routes = [
    { path: 'neworder', component: NeworderComponent, title: 'Nueva orden' },

    //order
    { path: 'neworder/order/add', component: AddOrderComponent, title: 'Proceso de creación' },
    { path: 'neworder/order/edit/:id', component: EditOrderComponent, title: 'Proceso de edición' },

    //assignment
    { path: 'neworder/assignment/add', component: AddComponent, title: 'Proceso de creación' },
    { path: 'neworder/assignment/edit/:id', component: EditComponent, title: 'Proceso de edición' },
    { path: 'neworder/assignment/reserve/:id', component: ReservesComponent, title: 'Proceso de reserva' },

    { path: 'payments', component: PayorderComponent, title: 'Realizando pago' },
    { path: '**', redirectTo: 'activeservices' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRouting { }