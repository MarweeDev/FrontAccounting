import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

//Components
import { NavComponent } from './components/header/nav/nav.component';
import { BreadcrumbsComponent } from './components/header/breadcrumbs/breadcrumbs.component';
import { MainlayoutComponent } from './components/aside/mainlayout/mainlayout.component';
import { FooterComponent } from './components/footer/footer/footer.component';
import { FilterSearchPipe } from './pipes/search/filter-search.pipe';
import { StatusComponent } from './components/error/status/status.component';
import { SelectComponent } from './components/form-items/select/select.component';

@NgModule({
  declarations: [
    NavComponent,
    BreadcrumbsComponent,
    MainlayoutComponent,
    FooterComponent,
    StatusComponent,
    SelectComponent
  ],
  imports: [
    CommonModule,
    //BrowserModule,
    FormsModule,
    RouterModule,
    NgOptimizedImage
  ],
  exports: [
    //components
    NavComponent, 
    BreadcrumbsComponent,
    MainlayoutComponent,
    FooterComponent,
    StatusComponent,
    SelectComponent
  ]
})
export class SharedModule { }
