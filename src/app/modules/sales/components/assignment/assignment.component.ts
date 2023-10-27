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

  viewNext() {
    this.newOrder.assignmentDisabled = false;
    this.newOrder.orderDisabled = true;

    //Aquí va la logica de la orden
  }
}
