import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

//Components
import { NavComponent } from './components/header/nav/nav.component';
import { BreadcrumbsComponent } from './components/header/breadcrumbs/breadcrumbs.component';
import { MainlayoutComponent } from './components/aside/mainlayout/mainlayout.component';
import { FooterComponent } from './components/footer/footer/footer.component';
import { FilterSearchPipe } from './pipes/search/filter-search.pipe';

@NgModule({
  declarations: [
    NavComponent,
    BreadcrumbsComponent,
    MainlayoutComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule
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
