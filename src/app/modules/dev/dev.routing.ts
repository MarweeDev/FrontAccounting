import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

import { DevResourcesComponent } from './pages/resources/dev-resources.component';

const routes: Routes = [
  { path: 'resources', component: DevResourcesComponent, canActivate: [AuthGuard], title: 'Desarrollo', data: { breadcrumb: 'Desarrollo/Recursos' } },
  { path: '**', redirectTo: 'resources' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevRouting { }
