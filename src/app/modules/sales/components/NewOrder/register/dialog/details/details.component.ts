import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/core/services/order/order.service';
import { RegisterComponent } from '../../register.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  @Input() orderCode?: any;
  estado : any;
  order : any;
  ListOrder: any[] =[];

  constructor(private router:Router, 
    private url: ActivatedRoute, 
    private ApiOrder: OrderService,
    private registercomponent: RegisterComponent) {
    //this.getUrl();
  }

  ngOnInit(): void {
    
  }

  ngOnChanges() : void {
    this.order = this.orderCode;
  }

  ngAfterContentInit():void {
    this.ApiOrder.getID(this.order).subscribe(data => {
      this.ListOrder = data.result;
      this.estado = this.ListOrder[0].estado;
    },error => {
      console.log('Error get: ', error)
    });
  }

  getUrl(){
    const urlSegments = this.url.snapshot.url;
    this.order = urlSegments[urlSegments.length - 1].path;
  }

  getConverPrice(e:any){
    var price = Number(e);
    return price;
  }

  getPayOrder(code:any){
    this.router.navigate(['/sales/neworder/payments', code]);
  }

  cancel(){
    //this.router.navigate(['sales/neworder/register']);
    this.registercomponent.visibleDetails = false;
  }

}
