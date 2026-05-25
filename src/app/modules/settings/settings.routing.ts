import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

import { SettingsDashboardComponent } from './pages/dashboard/settings-dashboard.component';
import { PreferencesComponent } from './pages/preferences/preferences.component';

const routes: Routes = [
  { path: 'dashboard', component: SettingsDashboardComponent, canActivate: [AuthGuard], title: 'Ajustes', data: { breadcrumb: 'Ajustes/Parametros' } },
  { path: 'preferences', component: PreferencesComponent, canActivate: [AuthGuard], title: 'Preferencias', data: { breadcrumb: 'Preferencias/Mi espacio' } },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRouting { }
