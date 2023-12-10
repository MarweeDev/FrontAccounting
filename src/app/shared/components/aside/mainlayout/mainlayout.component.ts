import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';

@Component({
  selector: 'app-mainlayout',
  templateUrl: './mainlayout.component.html',
  styleUrls: ['./mainlayout.component.css']
})
export class MainlayoutComponent implements OnInit, AfterViewInit {

  //#region propietari
  ListFilter : any[] = [];
  statusDisabled : boolean = false;
  //#endregion

  //#region Constructor
  constructor(private DataShared: DataSharedServicesService, private router: Router, private app: AppComponent) {
    this.ListFilter = [
      { id: 4, nombre: 'Disponible' },
      { id: 5, nombre: 'Reservado' },
      { id: 6, nombre: 'Descatado' }
    ];
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    let storedState = localStorage.getItem('option');
    if (storedState) {
      document.getElementById(storedState)?.classList.add("active");
    }
  }
  //#endregion

  //#region Methods
  OnRouterModule(router:any, e:any){
    localStorage.setItem('option', e.target.id);
    this.app.navDisabled = true;

    this.router.navigate([router]);
    this.app.OnHiddenBar();
    this.app.OnLoadingModule();
  }

  onButtonGroupClick(e:any){
    let clickedElement = e.target || e.srcElement;
    if(clickedElement.nodeName === "BUTTON" ) {
      let storedState = localStorage.getItem('option');
      if(storedState) {
        document.getElementById(storedState)?.classList.remove("active");
      }
  
      clickedElement.className += " active";
    }
  
  }
  //#endregion

}
