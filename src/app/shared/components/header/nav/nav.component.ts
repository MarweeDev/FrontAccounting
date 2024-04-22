import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { NavDTO } from 'src/app/core/models/nav';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, AfterViewInit {

  searchTerm = '';
  listNav : NavDTO[] = [];

  //#region Constructor
  constructor(private router: Router, private app: AppComponent, private DataShared: DataSharedServicesService,
    private cdRef: ChangeDetectorRef) {
    
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.listNav = [];
    this.DataShared.OnGetNav().subscribe(item => {
      this.listNav = item;
      console.log(item)
      this.cdRef.detectChanges();
    }, error => {
      console.log('error:', error)
    }
    );
  }
  //#endregion

  //#region Methods
  OnRouterModule(router:any, e:any){
    //localStorage.setItem('nav', e.target.id);
    this.app.navDisabled = true;

    this.router.navigate([router]);
    this.app.OnLoadingComponent();
  }

  OnSearchChange(search: string) {
    this.DataShared.OnSet(search);
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
