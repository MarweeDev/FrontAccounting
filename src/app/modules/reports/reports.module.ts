import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ReportsRouting } from './reports.routing';

import { GeneralComponent } from './pages/general/general.component';

@NgModule({
  declarations: [
    GeneralComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReportsRouting
  ]
})
export class ReportsModule { }
