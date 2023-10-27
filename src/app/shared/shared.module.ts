import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

//Components
import { NavComponent } from './components/header/nav/nav.component';
import { BreadcrumbsComponent } from './components/header/breadcrumbs/breadcrumbs.component';
import { MainlayoutComponent } from './components/aside/mainlayout/mainlayout.component';
import { FooterComponent } from './components/footer/footer/footer.component';

@NgModule({
  declarations: [
    NavComponent,
    BreadcrumbsComponent,
    MainlayoutComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    BrowserModule
  ],
  exports: [
    //components
    NavComponent, 
    BreadcrumbsComponent,
    MainlayoutComponent,
    FooterComponent
  ]
})
export class SharedModule { }
