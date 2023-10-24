import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-neworder',
  templateUrl: './neworder.component.html',
  styleUrls: ['./neworder.component.css']
})
export class NeworderComponent implements OnInit  {
  
  title : string | undefined;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const titleDOM = this.route.snapshot.routeConfig?.title;
    if(titleDOM){ this.title = titleDOM.toString()}
  }
}
