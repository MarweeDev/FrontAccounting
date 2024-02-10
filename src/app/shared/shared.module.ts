import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

//Components
import { NavComponent } from './components/header/nav/nav.component';
import { BreadcrumbsComponent } from './components/header/breadcrumbs/breadcrumbs.component';
import { MainlayoutComponent } from './components/aside/mainlayout/mainlayout.component';
import { FooterComponent } from './components/footer/footer/footer.component';
import { FilterSearchPipe } from './pipes/search/filter-search.pipe';
import { StatusComponent } from './components/error/status/status.component';

@NgModule({
  declarations: [
    NavComponent,
    BreadcrumbsComponent,
    MainlayoutComponent,
    FooterComponent,
    StatusComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    //components
    NavComponent, 
    BreadcrumbsComponent,
    MainlayoutComponent,
    FooterComponent,
    StatusComponent
  ]
})
export class SharedModule { }
