import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-container',
  templateUrl: './loading-container.component.html',
  styleUrls: ['./loading-container.component.css']
})
export class LoadingContainerComponent {
  @Input() active = false;
  @Input() message = 'Cargando informacion';
  @Input() compact = false;
}
