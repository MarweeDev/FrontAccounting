import { Component, OnInit } from '@angular/core';
import { EstadoDTO } from '../../../../core/models/estado';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';

@Component({
  selector: 'app-mainlayout',
  templateUrl: './mainlayout.component.html',
  styleUrls: ['./mainlayout.component.css']
})
export class MainlayoutComponent implements OnInit {

  //#region propietari
  ListFilter : any[] = [];
  statusDisabled : boolean = false;
  //#endregion

  //#region Constructor
  constructor(private DataShared: DataSharedServicesService) {
    this.DataShared.OnGetList().subscribe((list) => {
      if (list != undefined && list.length > 0 && list[0].id != 0) {
        this.ListFilter = list;
        this.statusDisabled = false;
      }
      else {
        this.ListFilter = list;
        this.statusDisabled = true;
      }
    });
  }

  ngOnInit(): void {
  }
  //#endregion

  //#region Methods
  //#endregion

}
