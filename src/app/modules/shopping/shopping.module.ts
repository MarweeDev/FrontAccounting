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
import { SharedModule } from "src/app/shared/shared.module";
import { DetailShoppingComponent } from './pages/detail-shopping/detail-shopping.component';
import { EditShoppingComponent } from './pages/edit-shopping/edit-shopping.component';

@NgModule({
  declarations: [
    //pages
    SupplierComponent,
    AddShoppingComponent,
    NewShoppingComponent,
    ViewShoppingComponent,
    DetailShoppingComponent,
    EditShoppingComponent
    
  ],
  imports: [
    CommonModule,
    ShoppingRouting,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    SharedModule
  ]
})
export class ShoppingModule { }
