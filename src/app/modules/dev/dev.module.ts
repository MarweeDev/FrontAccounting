import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

import { DevRouting } from './dev.routing';
import { DevResourcesComponent } from './pages/resources/dev-resources.component';

@NgModule({
  declarations: [
    DevResourcesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    DevRouting
  ]
})
export class DevModule { }
