import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NavDTO } from 'src/app/core/models/nav';

@Injectable({
  providedIn: 'root'
})
export class DataSharedServicesService {

  private listFilterShared = new BehaviorSubject<any[]>([]);

  private filter = new BehaviorSubject<any>("");

  private ListaNav = new BehaviorSubject<NavDTO[]>([]);

  private textBreadcrumb = new BehaviorSubject<string>("");

  // Método para obtener un observable de la lista compartida
  OnGetList() {
    return this.listFilterShared.asObservable();
  }

  // Método para actualizar la lista
  OnSetList(listFilterSharedNew: any[]) {
    this.listFilterShared.next(listFilterSharedNew);
  }

  // Método para obtener un observable del string
  OnGet() {
    return this.filter.asObservable();
  }
  // Método para actualizar el string
  OnSet(filter_: any) {
    this.filter.next(filter_);
  }

  //Método para setear las opciones del nav - lista
  OnSetNav(lista: NavDTO[]) {
    this.ListaNav.next(lista);
  }
  //Método para setear las opciones del nav
  OnGetNav() {
    return this.ListaNav.asObservable();
  }

  //Método para setear las opciones del breadcrumb (ruta) - string
  OnSetBreadcrumb(data: string) {
    this.textBreadcrumb.next(data);
  }
  //Método para setear las opciones del breadcrumb
  OnGetBreadcrumb() {
    return this.textBreadcrumb.asObservable();
  }

  constructor() { }
}
