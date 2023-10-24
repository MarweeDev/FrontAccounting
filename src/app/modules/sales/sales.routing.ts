import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Pages
import { NeworderComponent } from './pages/neworder/neworder.component';
import { ActiveservicesComponent } from './pages/activeservices/activeservices.component';
import { PendingservicesComponent } from './pages/pendingservices/pendingservices.component';

const routes: Routes = [
    { path: 'neworder', component: NeworderComponent, title: 'Nueva orden' },
    { path: 'activeservices', component: ActiveservicesComponent, title: 'Servicios activos' },
    { path: 'pendingservices', component: PendingservicesComponent, title: 'Servicios pendientes' },
    { path: '**', redirectTo: 'neworder' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRouting { }