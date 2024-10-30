import { Component } from '@angular/core';
import {HeaderComponent} from './header.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    HeaderComponent
  ],
  templateUrl: '../template/not-found.component.html',
  styleUrl: '../style/not-found.component.css'
})
export class NotFoundComponent {

}
