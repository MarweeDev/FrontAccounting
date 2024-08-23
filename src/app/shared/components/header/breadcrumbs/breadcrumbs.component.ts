import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit, AfterViewInit {

  title : string = "NameModule";
  breadcrumbParts : string[] = [];

  //#region constructor
  constructor(private app: AppComponent, private router: Router,
    private DataShared: DataSharedServicesService,
    private cdRef: ChangeDetectorRef
  ) {

  }
  ngOnInit(): void {
    
  }
  ngAfterViewInit(): void {
    //this.title = this.app.globalTitle;
    this.DataShared.OnGetBreadcrumb().subscribe(item => {
      this.title = item;
      this.breadcrumbParts = this.title!.split('/');
      this.cdRef.detectChanges();
    }, error => {
      console.log('error:', error)
    });
  }
  //#endregion

  //#region method
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
          elementSlider.className = "animate__animated animate__fadeInRight";
        }
      }
    }
  }

  OnRouterModule(router:any){
    this.router.navigate([router]);  
    this.app.OnHiddenBar();
    this.app.OnLoadingModule();

    //Resetea los active en el menu lateral
    localStorage.removeItem("nav_left");
  }
  //#endregion
}
