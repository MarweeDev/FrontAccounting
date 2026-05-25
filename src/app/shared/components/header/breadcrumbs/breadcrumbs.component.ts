import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { UserService } from 'src/app/core/services/user/user.service';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit, AfterViewInit {

  title : string = "NameModule";
  breadcrumbParts : string[] = [];
  public isProcessingDataUser? : boolean = true;

  //#region constructor
  constructor(private app: AppComponent, private router: Router,
    private DataShared: DataSharedServicesService,
    private cdRef: ChangeDetectorRef,
    private ApiUser: UserService
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //this.title = this.app.globalTitle;
    this.DataShared.OnGetBreadcrumb().subscribe(item => {
      this.title = item;
      this.breadcrumbParts = this.title!.split('/');
      this.isProcessingDataUser = true;
      this.onLoadUser();
      this.cdRef.detectChanges();
    }, error => {
      console.log('error:', error)
    });
  }
  //#endregion

  //#region method
  onLoadUser() {
    if (this.isProcessingDataUser) {
      const auth = sessionStorage.getItem('authenticator');
      if (auth != undefined && auth != "") {
        let t = new token();
        t.token = auth;
        this.ApiUser.getInfoUserCached(t).subscribe(data => {
          this.isProcessingDataUser = false;
          sessionStorage.setItem('idUser',data.result[0]?.id_usuario);
        });
      }
    }
  }

  OnExpandBar(){
    let element :any = document.getElementById('icon_btn_open');
    if(element != undefined){
      if (this.app.statusDisabledMain) {
        this.app.OnHiddenBar();
      }
      else{
        this.app.statusDisabledMain = true;
        let elementSlider :any = document.getElementById('slider_left');
        if (elementSlider != undefined) {
          element.className = "fa-solid fa-bars-staggered";
          elementSlider.className = "animated fadeInTopLeft";
        }
      }
    }
  }

  OnRouterModule(router:any){
    this.router.navigate([router]);  
    this.app.OnHiddenBar();

    //Resetea los active en el menu lateral
    localStorage.removeItem("nav_left");
  }

  // Función para generar un color aleatorio
  getColor(usuario: string): string {
    // Calcular un valor hash único basado en el nombre de usuario
    let hash = 0;
    for (let i = 0; i < usuario?.length; i++) {
      hash = usuario?.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convertir el valor hash en un color RGB
    const color = '#' + ((hash & 0xFFFFFF) | 0x1000000).toString(16).slice(1);
    
    return color;
  }
  //#endregion
}

export class token {
  token? : string
}
