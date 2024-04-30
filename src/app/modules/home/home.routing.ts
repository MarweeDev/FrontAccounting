import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Pages
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
    { path: 'main', component: MainComponent, title: 'Inicio' },
    { path: 'authorization/login', component: LoginComponent, title: 'Generando Autorización' },
    { path: '**', redirectTo: 'authorization/login' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRouting { }