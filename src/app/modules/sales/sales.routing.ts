import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Pages
import { NeworderComponent } from './pages/neworder/neworder.component';
import { ActiveservicesComponent } from './pages/activeservices/activeservices.component';
import { PendingservicesComponent } from './pages/pendingservices/pendingservices.component';

//Components
import { PayorderComponent } from './components/Payment/payorder/payorder.component';

//assignment
import { AddComponent } from './components/NewOrder/assignment/dialog/add/add.component';
import { EditComponent } from './components/NewOrder/assignment/dialog/edit/edit.component';
import { ReservesComponent } from './components/NewOrder/assignment/dialog/reserves/reserves.component';

const routes: Routes = [
    { path: 'neworder', component: NeworderComponent, title: 'Nueva orden' },
    { path: 'neworder/assignment/add', component: AddComponent, title: 'Proceso de creación' },
    { path: 'neworder/assignment/edit/:id', component: EditComponent, title: 'Proceso de edición' },
    { path: 'neworder/assignment/reserve/:id', component: ReservesComponent, title: 'Proceso de reserva' },

    { path: 'activeservices', component: ActiveservicesComponent, title: 'Servicios activos' },
    { path: 'pendingservices', component: PendingservicesComponent, title: 'Servicios pendientes' },
    { path: 'payments', component: PayorderComponent, title: 'Realizando pago' },
    { path: '**', redirectTo: 'activeservices' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRouting { }