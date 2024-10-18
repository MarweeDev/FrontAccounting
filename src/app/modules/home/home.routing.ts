import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

//Pages
import { MainComponent } from './pages/main/main.component';

const routes: Routes = [
    { path: 'main', component: MainComponent, canActivate: [AuthGuard], title: 'Inicio', data: {breadcrumb: 'Inicio'}  },
    { path: '**', redirectTo: 'main' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRouting { }