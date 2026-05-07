import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/home/pages/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Generando autorización', data: { breadcrumb: 'Login' } },
  { path: 'sales', loadChildren: () => import('./modules/sales/sales.module').then(m => m.SalesModule) },
  { path: 'home', redirectTo: 'sales/register' },
  { path: 'shopping', loadChildren: () => import('./modules/shopping/shopping.module').then(m => m.ShoppingModule) },
  { path: 'inventory', loadChildren: () => import('./modules/inventory/inventory.module').then(m => m.InventoryModule) },
  { path: 'reports', loadChildren: () => import('./modules/reports/reports.module').then(m => m.ReportsModule) },
  { path: 'settings', loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule) },
  { path: 'ajuste', redirectTo: 'settings/dashboard' },
  { path: 'ajustes', redirectTo: 'settings/dashboard' },
  { path: 'dev', loadChildren: () => import('./modules/dev/dev.module').then(m => m.DevModule) },
  { path: 'desarrollo', redirectTo: 'dev/resources' },
  { path: 'access-control', loadChildren: () => import('./modules/access-control/access-control.module').then(m => m.AccessControlModule) },
  { path: 'control-acceso', redirectTo: 'access-control/dashboard' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
