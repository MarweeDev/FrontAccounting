import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Routing
import { SalesRouting } from './sales.routing'

//Components
import { NeworderComponent } from './components/neworder/neworder.component';

@NgModule({
  declarations: [
    NeworderComponent
  ],
  imports: [
    CommonModule,
    SalesRouting
  ]
})
export class SalesModule { }
