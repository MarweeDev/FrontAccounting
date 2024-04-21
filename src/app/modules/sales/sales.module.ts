import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

//Routing
import { SalesRouting } from './sales.routing';

//Pages
import { NeworderComponent } from './pages/neworder/neworder.component';

//Components
import { OrderComponent } from './components/NewOrder/order/order.component'; //nueva orden
import { AssignmentComponent } from './components/NewOrder/assignment/assignment.component'; //nueva orden
import { ReserveComponent } from './components/NewOrder/reserve/reserve.component'; //nueva orden
import { RegisterComponent } from './components/NewOrder/register/register/register.component'; //nueva orden

import { PayorderComponent } from './components/Payment/payorder/payorder.component';

//Dialog AssignmentComponent
import { AddComponent } from './components/NewOrder/assignment/dialog/add/add.component';
import { EditComponent } from './components/NewOrder/assignment/dialog/edit/edit.component';
import { ReservesComponent } from './components/NewOrder/assignment/dialog/reserves/reserves.component';

//Dialog AssignmentComponent
import { AddOrderComponent } from './components/NewOrder/order/dialog/add/add.order.component';
import { EditOrderComponent } from './components/NewOrder/order/dialog/edit/edit.order.component';

@NgModule({
  declarations: [
    //pages
    NeworderComponent,

    //components
    OrderComponent,
    AssignmentComponent,
    ReserveComponent,
    RegisterComponent,
    
    PayorderComponent,
    
    //Dialog AssignmentComponent
    AddComponent,
    EditComponent,
    ReservesComponent,

    //Dialog OrderComponent
    AddOrderComponent,
    EditOrderComponent,
  ],
  imports: [
    CommonModule,
    SalesRouting,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class SalesModule { }
