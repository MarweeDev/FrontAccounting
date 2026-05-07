import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { ViewInventoryComponent } from './pages/view-inventory/view-inventory.component';

const routes: Routes = [
  { path: 'register', component: ViewInventoryComponent, canActivate: [AuthGuard], title: 'Inventario', data: { breadcrumb: 'Inventario/Gestión' } },
  { path: '**', redirectTo: 'register' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRouting { }
