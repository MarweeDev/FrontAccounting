import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { NavDTO } from 'src/app/core/models/nav';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, AfterViewInit {

  searchTerm = '';
  listNav : NavDTO[] = [];

  //#region Constructor
  constructor(private router: Router, private app: AppComponent, private DataShared: DataSharedServicesService,
    private cdRef: ChangeDetectorRef) {
    
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.listNav = new Array<NavDTO>();
    this.DataShared.OnGetNav().subscribe(item => {
      this.listNav = item.filter(x => x.visible == true || x.visible == undefined);
      this.cdRef.detectChanges();
    }, error => {
      console.log('error:', error)
    }
    );
  }
  //#endregion

  //#region Methods
  OnRouterModule(){
    //this.app.OnLoadingComponent();
  }

  OnSearchChange(search: string) {
    this.DataShared.OnSet(search);
  }

  OnHiddenBar(){
    this.app.OnHiddenBar();
  }

  onButtonGroupClick(e:any){
    let clickedElement = e.target || e.srcElement;
    if( clickedElement.nodeName === "BUTTON" ) {
  
      let isCertainButtonAlreadyActive = clickedElement.parentElement.querySelector(".active");
      // if a Button already has Class: .active
      if( isCertainButtonAlreadyActive ) {
        isCertainButtonAlreadyActive.classList.remove("active");
      }
  
      clickedElement.className += " active";
    }
  
  }
  //#endregion
}
