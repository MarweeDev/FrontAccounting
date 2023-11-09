import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EstadoDTO } from 'src/app/core/models/estado';

@Injectable({
  providedIn: 'root'
})
export class DataSharedServicesService {

  private listFilterShared = new BehaviorSubject<any[]>([]);

  // Método para obtener un observable de la lista compartida
  OnGetList() {
    return this.listFilterShared.asObservable();
  }

  // Método para actualizar la lista
  OnSetList(listFilterSharedNew: any[]) {
    this.listFilterShared.next(listFilterSharedNew);
  }

  constructor() { }
}
