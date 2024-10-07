import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

//Pages
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
    { path: 'main', component: MainComponent, canActivate: [AuthGuard], title: 'Inicio', data: {breadcrumb: 'Inicio'}  },
    { path: 'authorization/login', component: LoginComponent, title: 'Generando Autorización', data: {breadcrumb: 'Login'}  },
    { path: '**', redirectTo: 'authorization/login' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRouting { }