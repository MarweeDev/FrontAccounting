import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavDTO } from './core/models/nav';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { InactivityService } from './shared/directives/inactivity.service';
import { LoadingService, LoadingState } from './core/services/loading/loading.service';
import { Observable } from 'rxjs';
import { ThemeService, VisualEffectName } from './core/services/theme/theme.service';

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
  visualEffect$!: Observable<VisualEffectName>;
  snowParticles = Array.from({ length: 70 }, (_, index) => ({
    x: `${(index * 37) % 100}vw`,
    delay: `${-(index * 0.33)}s`,
    duration: `${10 + (index % 9) * 1.1}s`,
    size: `${3 + (index % 5)}px`,
    drift: `${-28 + (index % 9) * 7}px`,
    opacity: `${0.45 + (index % 5) * 0.1}`
  }));
  shadowParticles = Array.from({ length: 10 }, (_, index) => ({
    top: `${10 + (index % 5) * 13}vh`,
    delay: `${-(index * 1.2)}s`,
    duration: `${13 + (index % 4) * 2}s`,
    scale: `${0.72 + (index % 4) * 0.12}`,
    opacity: `${0.24 + (index % 4) * 0.08}`
  }));

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
    private themeService: ThemeService,
    //private inactivityService: InactivityService
  ) {}

  ngOnInit(): void {
    this.themeService.loadTheme();
    this.themeService.loadEffect();
    this.loadingState$ = this.loadingService.state$;
    this.visualEffect$ = this.themeService.effect$;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.shouldShowRouteLoader(event.url)) {
          this.loadingService.show('Abriendo modulo', 'route');
        }
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

  private shouldShowRouteLoader(url: string): boolean {
    return !url.startsWith('/login') && !url.startsWith('/status');
  }
  //#endregion  
}
