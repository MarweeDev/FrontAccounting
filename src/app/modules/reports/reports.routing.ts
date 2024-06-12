import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Pages
import { GeneralComponent } from './pages/general/general.component';

const routes: Routes = [
    { path: 'general', component: GeneralComponent, title: 'Reportes generales', data: {breadcrumb: 'Reportes/General'} },
    { path: '**', redirectTo: 'general' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRouting { }