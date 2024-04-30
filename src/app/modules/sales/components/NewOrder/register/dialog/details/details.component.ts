import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/core/services/order/order.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  estado : any;
  order : any;
  ListOrder: any[] =[];

  constructor(private router:Router, private url: ActivatedRoute, private ApiOrder: OrderService) {
    this.getUrl();
  }

  ngOnInit(): void {
    
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

  cancel(){
    this.router.navigate(['sales/neworder/register']);
  }

}
