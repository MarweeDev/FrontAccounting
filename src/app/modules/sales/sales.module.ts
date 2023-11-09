import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Routing
import { SalesRouting } from './sales.routing'

//Pages
import { NeworderComponent } from './pages/neworder/neworder.component';
import { ActiveservicesComponent } from './pages/activeservices/activeservices.component';
import { PendingservicesComponent } from './pages/pendingservices/pendingservices.component';

//Components
import { OrderComponent } from './components/order/order.component'; //nueva orden
import { AssignmentComponent } from './components/assignment/assignment.component';
import { ReserveComponent } from './components/reserve/reserve.component'; //nueva orden

@NgModule({
  declarations: [
    //pages
    NeworderComponent,
    ActiveservicesComponent,
    PendingservicesComponent,

    //components
    OrderComponent,
    AssignmentComponent,
    ReserveComponent
  ],
  imports: [
    CommonModule,
    SalesRouting
  ]
})
export class SalesModule { }
