import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Pages
import { NeworderComponent } from './pages/neworder/neworder.component';
import { ActiveservicesComponent } from './pages/activeservices/activeservices.component';
import { PendingservicesComponent } from './pages/pendingservices/pendingservices.component';

//Components
import { PayorderComponent } from './components/Payment/payorder/payorder.component';
import { AddComponent } from './components/NewOrder/assignment/dialog/add/add.component';

const routes: Routes = [
    { path: 'neworder', component: NeworderComponent, title: 'Nueva orden' },
    { path: 'neworder/add', component: AddComponent, title: 'Proceso de creación' },

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