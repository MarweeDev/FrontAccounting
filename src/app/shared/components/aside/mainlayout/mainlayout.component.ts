import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private DataShared: DataSharedServicesService, private router: Router) {
    this.ListFilter = [
      { id: 4, nombre: 'Disponible' },
      { id: 5, nombre: 'Reservado' },
      { id: 6, nombre: 'Descatado' }
    ];
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    
  }
  //#endregion

  //#region Methods
  OnRouterModule(router:any){
    this.router.navigate([router]);
  }
  //#endregion

}
