import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Pages
import { MainComponent } from './pages/main/main.component';

const routes: Routes = [
    { path: 'main', component: MainComponent, title: 'Inicio' },
    { path: '**', redirectTo: 'main' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRouting { }