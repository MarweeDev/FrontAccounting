import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private app: AppComponent, private DataShared: DataSharedServicesService, private cdRef: ChangeDetectorRef){

  }

  ngOnInit(): void {
    //this.app.OnHiddenBarAsync();
  }

  ngAfterContentInit():void {
    //Opciones para el nav
    this.app.listNav = [
    ];
    this.DataShared.OnSetNav(this.app.listNav);
  }
}
