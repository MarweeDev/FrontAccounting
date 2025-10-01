import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

//Routing
import { ShoppingRouting } from './shopping.routing'

//Pages
import { SupplierComponent } from './pages/supplier/supplier.component';
import { AddShoppingComponent } from './pages/supplier/dialog/add.shopping/add.shopping.component';
import { NewShoppingComponent } from './pages/new-shopping/new-shopping.component';
import { ViewShoppingComponent } from './pages/view-shopping/view-shopping.component';

@NgModule({
  declarations: [
    //pages
    SupplierComponent,
    AddShoppingComponent,
    NewShoppingComponent,
    ViewShoppingComponent
  ],
  imports: [
    CommonModule,
    ShoppingRouting,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ]
})
export class ShoppingModule { }