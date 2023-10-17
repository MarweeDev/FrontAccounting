import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

//Components
import { NavComponent } from './components/header/nav/nav.component';
import { BreadcrumbsComponent } from './components/header/breadcrumbs/breadcrumbs.component';

@NgModule({
  declarations: [
    NavComponent,
    BreadcrumbsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule
  ],
  exports: [
    NavComponent, BreadcrumbsComponent, CommonModule, BrowserModule
  ]
})
export class SharedModule { }
