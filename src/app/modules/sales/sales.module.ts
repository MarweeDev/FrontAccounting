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
import { RegisterComponent } from './components/NewOrder/register/register.component'; //nueva orden
import { PayorderComponent } from './components/NewOrder/payorder/payorder.component';

//Dialog AssignmentComponent
import { AddOrderComponent } from './components/NewOrder/order/dialog/add/add.order.component';
import { EditOrderComponent } from './components/NewOrder/order/dialog/edit/edit.order.component';

@NgModule({
  declarations: [
    //pages
    NeworderComponent,

    //components
    OrderComponent,
    RegisterComponent,
    PayorderComponent,

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
