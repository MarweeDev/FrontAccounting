import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

import { AccessDashboardComponent } from './pages/dashboard/access-dashboard.component';

const routes: Routes = [
  { path: 'dashboard', component: AccessDashboardComponent, canActivate: [AuthGuard], title: 'Control de Acceso', data: { breadcrumb: 'Control de Acceso/Administracion' } },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessControlRouting { }
