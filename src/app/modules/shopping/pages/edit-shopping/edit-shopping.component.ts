import { Component } from '@angular/core';
import { NewShoppingComponent } from '../new-shopping/new-shopping.component';

@Component({
  selector: 'app-edit-shopping',
  templateUrl: '../new-shopping/new-shopping.component.html',
  styleUrls: ['../new-shopping/new-shopping.component.css']
})
export class EditShoppingComponent extends NewShoppingComponent { }
