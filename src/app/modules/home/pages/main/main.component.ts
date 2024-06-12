import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ModuleService } from 'src/app/core/services/module/module.service';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  ListModule: any[] =[];

  constructor(
    private route : ActivatedRoute,
    private app: AppComponent,
    private router: Router,
    private ApiModule: ModuleService, 
    private DataShared: DataSharedServicesService, 
    private cdRef: ChangeDetectorRef){

  }

  ngOnInit(): void {
    //this.app.OnHiddenBarAsync();
    this.ApiModule.get().subscribe(data => {
      this.ListModule = data.module;
    });
  }

  ngAfterContentInit():void {
    //Opciones para el nav
    this.app.listNav = [
    ];
    this.DataShared.OnSetNav(this.app.listNav);

    //Cargar breadcrumb
    this.route.data.subscribe(data => {
      this.DataShared.OnSetBreadcrumb(data['breadcrumb']);
    });
  }

  OnRouterModule(router:any, id:any=null){
    this.router.navigate([router]);
    this.app.OnHiddenBar();
    this.app.OnLoadingModule();

    localStorage.setItem("nav_left", id ? id : '');
  }
}
