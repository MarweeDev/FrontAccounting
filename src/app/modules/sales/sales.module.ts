import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Routing
import { SalesRouting } from './sales.routing'

//Pages
import { NeworderComponent } from './pages/neworder/neworder.component';
import { ActiveservicesComponent } from './pages/activeservices/activeservices.component';
import { PendingservicesComponent } from './pages/pendingservices/pendingservices.component';

//Components
import { OrderComponent } from './components/NewOrder/order/order.component'; //nueva orden
import { AssignmentComponent } from './components/NewOrder/assignment/assignment.component'; //nueva orden
import { ReserveComponent } from './components/NewOrder/reserve/reserve.component'; //nueva orden

import { ServicesComponent } from './components/ActiveServices/services/services.component'; //servicios en curso

import { ServicesPayComponent } from './components/PendingServices/services-pay/services-pay.component'; //servicios pendientes

import { PayorderComponent } from './components/Payment/payorder/payorder.component';

//Dialog AssignmentComponent
import { AddComponent } from './components/NewOrder/assignment/dialog/add/add.component';
import { EditComponent } from './components/NewOrder/assignment/dialog/edit/edit.component';
import { DeleteComponent } from './components/NewOrder/assignment/dialog/delete/delete.component';
import { StatusComponent } from './components/NewOrder/assignment/dialog/status/status.component'; //pagos

@NgModule({
  declarations: [
    //pages
    NeworderComponent,
    ActiveservicesComponent,
    PendingservicesComponent,

    //components
    OrderComponent,
    AssignmentComponent,
    ReserveComponent,
    
    ServicesComponent,
    ServicesPayComponent,
    PayorderComponent,
    
    //Dialog AssignmentComponent
    AddComponent,
    EditComponent,
    DeleteComponent,
    StatusComponent
  ],
  imports: [
    CommonModule,
    SalesRouting
  ]
})
export class SalesModule { }
