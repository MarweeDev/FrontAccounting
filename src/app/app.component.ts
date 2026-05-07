import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavDTO } from './core/models/nav';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { InactivityService } from './shared/directives/inactivity.service';
import { LoadingService, LoadingState } from './core/services/loading/loading.service';
import { Observable } from 'rxjs';

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
  loadingState$!: Observable<LoadingState>;

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
    private loadingService: LoadingService,
    //private inactivityService: InactivityService
  ) {}

  ngOnInit(): void {
    this.loadingState$ = this.loadingService.state$;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingService.show('Abriendo modulo', 'route');
      }

      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.loadingService.hide();
      }
    });
  }
  //#endregion

  //#region methods
  OnExpandBar(){
    let element :any = document.getElementById('icon_btn_open');
    if(element != undefined){
      this.statusDisabledMain = !this.statusDisabledMain;
      element.className = this.statusDisabledMain ? "fa-solid fa-bars-staggered" : "fa-solid fa-bars";
    }
  }
  OnHiddenBar(){
    let element :any = document.getElementById('icon_btn_open');
    if(element != undefined){
      element.className = "fa-solid fa-bars";
    }
    this.statusDisabledMain = false;
  }

  OnHiddenBarAsync(){
    this.statusDisabledMain = true;
    this.cdRef.detectChanges();
  }

  OnLoadingModule() {
    this.loadingService.pulse('Cargando modulo', 'manual');
  }
  OnLoadingComponent() {
    this.loadingService.pulse('Actualizando vista', 'manual');
  }
  //#endregion  
}
