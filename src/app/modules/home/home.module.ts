import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

//Routing
import { HomeRouting } from './home.routing'

//Pages
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';

@NgModule({
  declarations: [
    //pages
    MainComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    HomeRouting,
    ReactiveFormsModule
  ]
})
export class HomeModule { }
