import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { OrderDTO } from 'src/app/core/models/order';
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

  todayStr ?: string;
  weekRange ?: string;
  monthRange ?: string;
  yearRange ?: string;

  disabledDateCalendar: boolean = false;
  DateMaxInput ?: string;

  constructor(
    private app: AppComponent, 
    private DataShared: DataSharedServicesService,
    private router: Router,
    private ApiOrder: OrderService) 
  {
    let today = new Date();
    this.DateMaxInput = this.formatDate(today);
  }

  ngOnInit(): void {
    this.onLoadSelectDate();
  }

  ngAfterContentInit():void {
    //Opciones para el nav
    this.app.listNav = [
      { nombre: 'Nueva orden', url: 'sales/neworder/order', icon: 'fa-solid fa-plus', type: "btn-companyTwo", search: true},
    ];
    this.DataShared.OnSetNav(this.app.listNav);

    this.onLoadOrder();
  }

  onLoadOrder() {
    debugger;
    let elementDate :any = document.getElementById('selectDate');
    let elementInputDate :any = document.getElementById('selectDateCalendar');
    let elementFilter :any = document.getElementById('selectFilter');
    let DateEle;

    if (elementDate.value == 'Hoy') {
      let today = new Date();
      DateEle = this.formatDate(today);
      this.disabledDateCalendar = false;
    }
    else if (elementDate.value == 'personalizada') {
      DateEle = elementInputDate?.value;
      this.disabledDateCalendar = true;
    }
    else {
      DateEle = elementDate.value;
      this.disabledDateCalendar = false;
    }

    const orderData: OrderDTO = {
      id_estadoorden: elementFilter.value,
      fecha: DateEle
    };
    
    if (DateEle != undefined) {
      this.ApiOrder.getFind(orderData).subscribe(data => {
        this.ListOrder = data.result;
  
        this.onSelectInit();
      },error => {
        console.log('Error get: ', error)
      });
    }
  }

  onSelectInit() {
    let element :any = document.getElementById('selectCount');
    this.TotalPag = Math.ceil(this.ListOrder?.length / element.value);
    this.itemsPorPagina = element.value;
    this.FilterListOrder = this.ListOrder?.slice(0, this.itemsPorPagina);

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


  //Select fecha
  // Función para formatear la fecha en formato YYYY-MM-DD
  formatDate(date:Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onLoadSelectDate() {
    const today = new Date();

    // Fecha de hace una semana
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    const lastWeekStr = this.formatDate(lastWeek);
    
    // Fecha de hace un mes
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    const lastMonthStr = this.formatDate(lastMonth);

    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);
    const lastYearStr = this.formatDate(lastYear);
    
    this.todayStr = this.formatDate(today);
    this.weekRange = `${lastWeekStr}`;
    this.monthRange = `${lastMonthStr}`;
    this.yearRange = `${lastYearStr}`;
  }

}
