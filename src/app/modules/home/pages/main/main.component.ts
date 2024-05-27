import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private app: AppComponent,
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
  }

  OnRouterModule(router:any){
    this.router.navigate([router]);
    this.app.OnHiddenBar();
  }
}
