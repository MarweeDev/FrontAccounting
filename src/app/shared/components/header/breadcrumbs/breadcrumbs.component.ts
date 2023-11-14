import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit {

  title : string = "Name error";

  constructor(private route : ActivatedRoute) {

    const titleDOM = this.route.snapshot.routeConfig?.title;
    if(titleDOM){ this.title = titleDOM.toString()}
   }

  ngOnInit(): void {
    
  }
}
