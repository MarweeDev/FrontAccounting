import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { OrderDTO } from 'src/app/core/models/order';
import { OrderService } from 'src/app/core/services/order/order.service';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-export-order',
  templateUrl: './export-order.component.html',
  styleUrls: ['./export-order.component.css']
})
export class ExportOrderComponent {

  ListOrder: any[] =[];
  FilterListOrder : any[] = [];
  currentPage: number = 1;
  itemsPorPagina: number = 10;
  TotalPag : number = 0;
  todayStr ?: string;
  weekRange ?: string;
  monthRange ?: string;
  yearRange ?: string;
  DateMaxInput ?: string;

  constructor(
    private route : ActivatedRoute,
    private app: AppComponent, 
    private DataShared: DataSharedServicesService,
    private router: Router,
    private ApiOrder: OrderService) 
  {
  }

  ngAfterContentInit():void {
    //Opciones para el nav
    this.app.listNav = [
      { nombre: 'Volver', url: 'sales/register', type: "btn-origin"},
    ];
    this.DataShared.OnSetNav(this.app.listNav);

    //Cargar breadcrumb
    this.route.data.subscribe(data => {
      this.DataShared.OnSetBreadcrumb(data['breadcrumb']);
    });
  }

  onExportExcel(): void {
    // Convertir los datos en una hoja de Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ListOrder);
    // Obtener el rango de la hoja de trabajo
    const range = XLSX.utils.decode_range(worksheet['!ref']!);
    // Aplicar formato a los títulos (primera fila)
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cellAddress]) continue;

      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } }, // Texto en blanco y negrita
        fill: { fgColor: { rgb: '4CAF50' } } // Fondo verde
      };
    }
    // Crear un libro de trabajo y agregar la hoja
    const workbook: XLSX.WorkBook = { Sheets: { 'Datos': worksheet }, SheetNames: ['Datos'] };
    // Generar el archivo Excel
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // Llamar a la función para guardar el archivo
    this.onSaveExcel(excelBuffer, 'Reporte ordenes');
  }

  onSaveExcel(buffer: any, nombreArchivo: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `${nombreArchivo}.xlsx`);
  }

  onRemoveEmojis(text: string): string {
    return text.replace(/[^\w\s]/gi, '');
  }

  onLoadOrder() {
    let elementDateInit :any = document.getElementById('selectDateCalendarInit');
    let elementDateFin :any = document.getElementById('selectDateCalendarFinish');

    if (elementDateInit != undefined && elementDateInit.value != undefined && elementDateInit.value != "" &&
        elementDateFin != undefined && elementDateFin.value != undefined && elementDateFin.value != ""
    ) {
      const orderData: ExportDTO = {
        fecha_init: elementDateInit.value,
        fecha_fin: elementDateFin.value
      };
      
      this.ApiOrder.getFinExport(orderData).subscribe(data => {
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

  formatDate(date:Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getConverPrice(e:any){
    var price = Number(e);
    return price;
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

  onSelectChange(event: any) {
    // Obtén el valor seleccionado y guárdalo en la propiedad selectedId
    let selectedId = event.target.value;
  }
}


export class ExportDTO {
  fecha_init?: Date;
  fecha_fin?: Date;
}