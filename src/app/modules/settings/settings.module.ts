import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

import { SettingsRouting } from './settings.routing';
import { SettingsDashboardComponent } from './pages/dashboard/settings-dashboard.component';

@NgModule({
  declarations: [
    SettingsDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    SettingsRouting
  ]
})
export class SettingsModule { }
