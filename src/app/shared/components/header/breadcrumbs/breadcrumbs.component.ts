import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit, AfterViewInit {

  title : string = "NameModule";

  //#region constructor
  constructor(private route : ActivatedRoute, private app: AppComponent, private router: Router) {

  }
  ngOnInit(): void {
    
  }
  ngAfterViewInit(): void {
    //this.title = this.app.globalTitle;
  }
  //#endregion

  //#region method
  OnExpandBar(){
    let element :any = document.getElementById('icon_btn_open');
    if(element != undefined){
      if (this.app.statusDisabledMain) {
        this.app.OnHiddenBar();
        console.log("Close bar: ", this.app.statusDisabledMain);
      }
      else{
        this.app.statusDisabledMain = true;
        element.className = "fa-solid fa-bars-staggered";
        console.log("Open bar: ", this.app.statusDisabledMain);
      }
    }
  }

  OnRouterModule(router:any){
    this.router.navigate([router]);
  }
  //#endregion
}
