import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  //#region Constructor
  constructor(private router: Router, private app: AppComponent) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    let storedState = localStorage.getItem('event-active');
  }
  //#endregion

  //#region Methods
  OnRouterModule(router:any){
    this.router.navigate([router]);
  }

  OnHiddenBar(){
    let element :any = document.getElementById('icon_btn_open');
    let elementSlider :any = document.getElementById('slider_left');
    if(element != undefined && elementSlider != undefined){
      element.className = "fa-solid fa-bars";
      elementSlider.className = "slider animate__animated animate__fadeOutLeft";
      setTimeout(()=>{this.app.statusDisabledMain = false;},1000);
    }
  }

  onButtonGroupClick(e:any){
    let clickedElement = e.target || e.srcElement;
    debugger;
    if( clickedElement.nodeName === "BUTTON" ) {
  
      let isCertainButtonAlreadyActive = clickedElement.parentElement.querySelector(".active");
      // if a Button already has Class: .active
      if( isCertainButtonAlreadyActive ) {
        isCertainButtonAlreadyActive.classList.remove("active");
      }
  
      clickedElement.className += " active";
    }
  
  }
  //#endregion
}
