import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

import { AccessControlRouting } from './access-control.routing';
import { AccessDashboardComponent } from './pages/dashboard/access-dashboard.component';

@NgModule({
  declarations: [
    AccessDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    AccessControlRouting
  ]
})
export class AccessControlModule { }
