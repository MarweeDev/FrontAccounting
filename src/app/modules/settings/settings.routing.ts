import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

import { SettingsDashboardComponent } from './pages/dashboard/settings-dashboard.component';

const routes: Routes = [
  { path: 'dashboard', component: SettingsDashboardComponent, canActivate: [AuthGuard], title: 'Ajustes', data: { breadcrumb: 'Ajustes/Parametros' } },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRouting { }
