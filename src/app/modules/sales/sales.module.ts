import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

//Routing
import { SalesRouting } from './sales.routing';

//Pages
import { NeworderComponent } from './pages/neworder/neworder.component';

//Components
import { OrderComponent } from './components/NewOrder/order/order.component'; //nueva orden
import { RegisterComponent } from './components/NewOrder/register/register.component'; //nueva orden
import { PayorderComponent } from './components/NewOrder/payorder/payorder.component'; //nueva orden

//Dialog OrderComponent
import { AddOrderComponent } from './components/NewOrder/order/dialog/add/add.order.component';
import { EditOrderComponent } from './components/NewOrder/order/dialog/edit/edit.order.component';

//Dialog RegisterComponent
import { DetailsComponent } from './components/NewOrder/register/dialog/details/details.component';

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

    //Dialog RegisterComponent
    DetailsComponent,
  ],
  imports: [
    CommonModule,
    SalesRouting,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ]
})
export class SalesModule { }
