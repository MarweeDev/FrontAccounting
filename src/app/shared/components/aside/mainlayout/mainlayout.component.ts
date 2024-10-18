import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ModuleService } from 'src/app/core/services/module/module.service';
import { OrderService } from 'src/app/core/services/order/order.service';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-mainlayout',
  templateUrl: './mainlayout.component.html',
  styleUrls: ['./mainlayout.component.css']
})
export class MainlayoutComponent implements OnInit, AfterViewInit {

  user : string = "ivagomal";
  rol : string = "super admin";
  total : number = 0;
  activeButtonId: number | null = null;
  ListModule: any[] =[];
  ListOrder: any[] =[];

  constructor(private router: Router, private app: AppComponent, 
    private ApiModule: ModuleService, private ApiOrder: OrderService, private ApiUser: UserService) {
  }

  ngOnInit(): void {
    /*this.ApiModule.get().subscribe(data => {
      this.ListModule = data.module;
    });*/

    const auth = sessionStorage.getItem('authenticator');

    if (auth != undefined && auth != "") {
      let t = new token();
      t.token = auth;
      this.ApiUser.getInfoUser(t).subscribe(data => {
        this.ListModule = data.result;
        this.user  = this.ListModule[0].usuario;
        this.rol  = this.ListModule[0].rol;
        console.log(this.ListModule)
      });
    }

    const savedId = localStorage.getItem("nav_left");
    if (savedId) {
      this.activeButtonId = parseInt(savedId, 10);
    }
  }

  ngAfterViewInit(): void {
    
  }

  OnRouterModule(router:any, id:any=null){
    this.router.navigate([router]);
    this.app.OnHiddenBar();
    this.app.OnLoadingModule();

    this.activeButtonId = id;
    localStorage.setItem("nav_left", id ? id : '');

    if (id == 0) {
      sessionStorage.clear();
    }
  }

  // Función para generar un color aleatorio
  getColor(usuario: string): string {
    // Calcular un valor hash único basado en el nombre de usuario
    let hash = 0;
    for (let i = 0; i < usuario.length; i++) {
      hash = usuario.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convertir el valor hash en un color RGB
    const color = '#' + ((hash & 0xFFFFFF) | 0x1000000).toString(16).slice(1);
    
    return color;
  }

}


export class token {
  token? : string
}