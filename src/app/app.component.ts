import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  //#region properties

  /*Cargar*/
  statusLoaderModule : boolean = false;
  statusLoaderComponent : boolean = false;

  /*Estado menu*/
  statusDisabledMain : boolean = false;
  navDisabled : boolean = false;

  /*Propiedad para titulo del breadcrumbs*/
  globalTitle : string = "module"

  /*searchterm*/
  searchTerm = '';

  //#endregion
  
  //#region Constructor
  constructor() {
  }

  ngOnInit(): void {
  }
  //#endregion

  //#region methods
  OnExpandBar(){
    let element :any = document.getElementById('icon_btn_open');
    if(element != undefined){
      if (this.statusDisabledMain) {
        this.statusDisabledMain = false;
        element.className = "fa-solid fa-bars";
        console.log("Close bar: ", this.statusDisabledMain);
      }
      else{
        this.statusDisabledMain = true;
        element.className = "fa-solid fa-bars-staggered";
        console.log("Open bar: ", this.statusDisabledMain);
      }
    }
  }
  OnHiddenBar(){
    let element :any = document.getElementById('icon_btn_open');
    let elementSlider :any = document.getElementById('slider_left');
    if(element != undefined && elementSlider != undefined){
      element.className = "fa-solid fa-bars";
      elementSlider.className = "slider animate__animated animate__fadeOutLeft";
      setTimeout(()=>{this.statusDisabledMain = false;},1000);
    }
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
