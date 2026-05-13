import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ModuleService } from 'src/app/core/services/module/module.service';
import { OrderService } from 'src/app/core/services/order/order.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { ShiftDTO } from 'src/app/core/models/shift';
import { CashShiftService } from 'src/app/core/services/cash-shift/cash-shift.service';
import { BusinessProfileType } from 'src/app/core/models/businessProfile';
import { SettingParameterService } from 'src/app/core/services/setting-parameter/setting-parameter.service';

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
  currentShift: ShiftDTO | null = null;
  openingAmount = 0;
  countedCash = 0;
  businessProfile: BusinessProfileType = 'pymes';
  showShiftWidget = true;

  constructor(private router: Router, private app: AppComponent, 
    private ApiModule: ModuleService, private ApiOrder: OrderService, private ApiUser: UserService,
    private cashShiftService: CashShiftService,
    private settingParameterService: SettingParameterService) {
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

    this.loadBusinessProfileConfig();
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

  loadCurrentShift(): void {
    this.cashShiftService.current().subscribe({
      next: data => this.currentShift = data.result,
      error: () => this.currentShift = null
    });
  }

  loadBusinessProfileConfig(): void {
    this.settingParameterService.get().subscribe({
      next: data => {
        const parameters = data.result || [];
        const profileParameter = parameters.find(item => item.grupo === 'empresa' && item.clave === 'perfil_negocio');
        const shiftParameter = parameters.find(item => item.grupo === 'empresa' && item.clave === 'perfiles_turno_habilitado');
        this.businessProfile = this.normalizeBusinessProfile(profileParameter?.valor || null);
        this.showShiftWidget = this.isShiftVisibleForProfile(shiftParameter?.valor);
        if (this.showShiftWidget) {
          this.loadCurrentShift();
        }
      },
      error: () => {
        this.businessProfile = 'pymes';
        this.showShiftWidget = true;
        this.loadCurrentShift();
      }
    });
  }

  openShift(): void {
    this.cashShiftService.open({ opening_amount: Number(this.openingAmount || 0), notes: 'Apertura desde aside' }).subscribe({
      next: data => {
        this.currentShift = data.result;
        this.openingAmount = 0;
      }
    });
  }

  closeShift(): void {
    if (!this.currentShift?.id) return;
    this.cashShiftService.close(this.currentShift.id, { counted_cash: Number(this.countedCash || 0), notes: 'Cierre desde aside' }).subscribe({
      next: data => {
        this.currentShift = data.result;
        this.countedCash = 0;
      }
    });
  }

  getShiftTitle(): string {
    if (this.businessProfile === 'instituciones') return this.currentShift?.status === 'open' ? 'Jornada abierta' : 'Sin jornada';
    if (this.businessProfile === 'pymes') return this.currentShift?.status === 'open' ? 'Caja abierta' : 'Sin caja';
    return this.currentShift?.status === 'open' ? 'Turno abierto' : 'Sin turno';
  }

  getOpeningPlaceholder(): string {
    if (this.businessProfile === 'instituciones') return 'Fondo inicial';
    if (this.businessProfile === 'pymes') return 'Base caja';
    return 'Monto base';
  }

  getClosingPlaceholder(): string {
    if (this.businessProfile === 'instituciones') return 'Conteo jornada';
    return 'Conteo cierre';
  }

  private normalizeBusinessProfile(value: string | null): BusinessProfileType {
    if (value === 'instituto') return 'instituciones';
    if (value === 'restaurante' || value === 'bar') return 'gastronomia';
    if (value === 'servicios' || value === 'productos' || value === 'pyme' || value === 'personalizado') return 'pymes';
    if (value === 'gastronomia' || value === 'instituciones' || value === 'pymes') return value;
    return 'pymes';
  }

  private isShiftVisibleForProfile(value?: string): boolean {
    if (!value) return this.businessProfile !== 'instituciones';

    try {
      const enabledProfiles = JSON.parse(value);
      if (!Array.isArray(enabledProfiles)) return true;
      return enabledProfiles
        .map(item => this.normalizeBusinessProfile(item))
        .includes(this.businessProfile);
    } catch {
      return true;
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
