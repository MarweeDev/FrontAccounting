import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { InventoryRouting } from './inventory.routing';
import { ViewInventoryComponent } from './pages/view-inventory/view-inventory.component';

@NgModule({
  declarations: [
    ViewInventoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    InventoryRouting
  ]
})
export class InventoryModule { }
