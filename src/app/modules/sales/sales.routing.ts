import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { NeworderComponent } from './components/neworder/neworder.component';

const routes: Routes = [
    { path: 'neworder', component: NeworderComponent, title: 'Nueva orden' },
    { path: '**', redirectTo: 'neworder' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRouting { }