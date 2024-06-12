import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

//Routing
import { ShoppingRouting } from './shopping.routing'

//Pages
import { SupplierComponent } from './pages/supplier/supplier.component';
import { AddShoppingComponent } from './pages/supplier/dialog/add.shopping/add.shopping.component';

@NgModule({
  declarations: [
    //pages
    SupplierComponent,
    AddShoppingComponent
  ],
  imports: [
    CommonModule,
    ShoppingRouting,
    ReactiveFormsModule
  ]
})
export class ShoppingModule { }