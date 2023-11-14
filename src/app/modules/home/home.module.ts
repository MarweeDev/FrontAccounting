import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Routing
import { HomeRouting } from './home.routing'

//Pages
import { MainComponent } from './pages/main/main.component';

@NgModule({
  declarations: [
    //pages
    MainComponent
  ],
  imports: [
    CommonModule,
    HomeRouting
  ]
})
export class HomeModule { }
