import { Component, OnInit } from '@angular/core';
import { NeworderComponent } from '../../pages/neworder/neworder.component'

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit {

  constructor(private newOrder : NeworderComponent) {
  }

  ngOnInit(): void {
  }

  viewNext(e:any, dom:any) {
    if(e.target.attributes['id'].value != undefined && e.target.attributes['name'].value != undefined) {
      this.newOrder.assignmentDisabled = false;
      this.newOrder.orderDisabled = true;
  
      //Aquí va la logica de la orden
      //console.log(e.target.attributes);
      this.newOrder.mesaModels.id = e.target.attributes['id'].value;
      this.newOrder.mesaModels.numero = e.target.attributes['id'].value;
      this.newOrder.mesaModels.nombre = e.target.attributes['name'].value;
    }
  }
}
