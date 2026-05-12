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
  companyName : string = "Accounts POS";
  total : number = 0;
  imagenBase64: string = '';
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
      this.ApiUser.getInfoUserCached(t).subscribe(data => {
        this.ListModule = data.result;
        this.user  = this.ListModule[0].usuario;
        this.rol  = this.ListModule[0].rol;
        this.companyName = this.ListModule[0].empresa || this.ListModule[0].responsable || "Accounts POS";
        this.imagenBase64 = `${this.ListModule[0].imagen}`;
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

    this.activeButtonId = id;
    localStorage.setItem("nav_left", id ? id : '');

    if (id == 0) {
      this.ApiUser.clearInfoUserCache();
      sessionStorage.clear();
    }
  }

  isReportsModule(item: any): boolean {
    const route = `${item?.ruta || ''}`.toLowerCase();
    const moduleName = `${item?.modulo || ''}`.toLowerCase();
    return route.includes('reports') || moduleName.includes('reporte');
  }

  getInitials(value?: string): string {
    const text = `${value || this.user || 'U'}`.trim();
    const parts = text.split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  getModuleKind(item: any): string {
    const route = `${item?.ruta || ''}`.toLowerCase();
    const moduleName = `${item?.modulo || ''}`.toLowerCase();
    if (route.includes('sales') || moduleName.includes('venta')) return 'Caja';
    if (route.includes('shopping') || moduleName.includes('compra')) return 'Gasto';
    if (route.includes('inventory') || moduleName.includes('inventario')) return 'Stock';
    if (route.includes('reports') || moduleName.includes('reporte')) return 'IA';
    if (route.includes('settings') || moduleName.includes('ajuste')) return 'Config';
    if (route.includes('access') || moduleName.includes('acceso')) return 'Admin';
    if (route.includes('dev') || moduleName.includes('dev')) return 'Lab';
    return 'Modulo';
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

  getBase64FromBuffer(buffer: number[]): string {
    const uint8Array = new Uint8Array(buffer);
    let binary = '';
    uint8Array.forEach(byte => binary += String.fromCharCode(byte));
    return window.btoa(binary);
  }

}


export class token {
  token? : string
}
