import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { OrderService } from 'src/app/core/services/order/order.service';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  ListOrder: any[] =[];
  FilterListOrder : any[] = [];
  currentPage: number = 1;
  itemsPorPagina: number = 10;
  TotalPag : number = 0;

  constructor(
    private app: AppComponent, 
    private DataShared: DataSharedServicesService,
    private router: Router,
    private ApiOrder: OrderService) 
  {
  }

  ngOnInit(): void {
    this.ApiOrder.get().subscribe(data => {
      this.ListOrder = data.result;

      this.onSelectInit();
    });
  }

  onSelectInit() {
    let element :any = document.getElementById('selectCount');
    this.TotalPag = Math.ceil(this.ListOrder.length / element.value);
    this.itemsPorPagina = element.value;
    this.FilterListOrder = this.ListOrder.slice(0, this.itemsPorPagina);

    if (this.currentPage > this.TotalPag) {
      this.currentPage = 1;

    }
  }

  nextPage() {
    if (this.currentPage < this.TotalPag) {
      this.currentPage++;
      const startIndex = (this.currentPage - 1) * this.itemsPorPagina;
      const endIndex = startIndex + this.itemsPorPagina;
      this.FilterListOrder = this.ListOrder.slice(startIndex, endIndex);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      const startIndex = (this.currentPage - 1) * this.itemsPorPagina;
      const endIndex = startIndex + this.itemsPorPagina;
      this.FilterListOrder = this.ListOrder.slice(startIndex, endIndex);
    }
  }

  ngAfterContentInit():void {
    //Opciones para el nav
    this.app.listNav = [
      { nombre: 'Nueva orden', url: 'sales/neworder/order', icon: 'fa-solid fa-plus', type: "btn-companyTwo", search: true},
    ];
    this.DataShared.OnSetNav(this.app.listNav);
  }

  formatDateTime(dateTime: string): { fecha: string, hora: string } {
    const date = new Date(dateTime);
    const fecha = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`; // Formato dd-MM-yyyy
    const hora = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`; // Formato HH:mm:ss
    return { fecha, hora };
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

  getDetailsOrder(code:any){
    this.router.navigate(['/sales/neworder/register/details', code]);
  }

  getPayOrder(code:any){
    this.router.navigate(['/sales/neworder/payments', code]);
  }

}
