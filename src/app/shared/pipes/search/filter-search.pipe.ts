import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterSearch'
})
export class FilterSearchPipe implements PipeTransform {

  items: any[] = [];

  set(items: any[]){
    this.items = items;
  }
  transform(filtro: string): any[] {
    if (!filtro || filtro === '') {
      return this.items;
    }

    return this.items.filter(item => item.toLowerCase().includes(filtro.toLowerCase()));
  }

}
