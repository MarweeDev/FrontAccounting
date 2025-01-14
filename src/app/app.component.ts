import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavDTO } from './core/models/nav';
import { Router } from '@angular/router';
import { InactivityService } from './shared/directives/inactivity.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  //#region properties

  /*Nav options*/
  listNav : NavDTO[] = [];

  /*Cargar*/
  statusLoaderModule : boolean = false;
  statusLoaderComponent : boolean = false;

  /*Estado menu*/
  statusDisabledMain : boolean = false;
  statusDisabledBtnMain : boolean = false;
  navDisabled : boolean = false;

  /*Propiedad para titulo del breadcrumbs*/
  globalTitle : string = "module"

  /*searchterm*/
  searchTerm = '';

  //#endregion
  
  //#region Constructor
  constructor(
    private cdRef: ChangeDetectorRef, 
    private router: Router,
    private inactivityService: InactivityService) {
  }

  ngOnInit(): void {
    
  }
  //#endregion

  //#region methods
  OnExpandBar(){
    let element :any = document.getElementById('icon_btn_open');
    let elementSlider :any = document.getElementById('slider_left');
    if(element != undefined && elementSlider != undefined){
      if (this.statusDisabledMain) {
        this.statusDisabledMain = false;
        element.className = "fa-solid fa-bars";
        elementSlider.className = "animate__animated animate__fadeOutTopLeft";
      }
      else{
        this.statusDisabledMain = true;
        element.className = "fa-solid fa-bars-staggered";
        elementSlider.className = "animate__animated animate__fadeInTopLeft";
      }
    }
  }
  OnHiddenBar(){
    let element :any = document.getElementById('icon_btn_open');
    let elementSlider :any = document.getElementById('slider_left');
    if(element != undefined && elementSlider != undefined){
      element.className = "fa-solid fa-bars";
      elementSlider.className = "animate__animated animate__fadeOutTopLeft";
      setTimeout(()=>{this.statusDisabledMain = false;},1000);
    }
  }

  OnHiddenBarAsync(){
    this.statusDisabledMain = true;
    this.cdRef.detectChanges();
  }

  OnLoadingModule() {
    this.statusLoaderModule = true;
    setTimeout(() => {
      this.statusLoaderModule = false;
    }, 900);
  }
  OnLoadingComponent() {
    this.statusLoaderComponent = true;
    setTimeout(() => {
      this.statusLoaderComponent = false;
    }, 900);
  }
  //#endregion  
}
