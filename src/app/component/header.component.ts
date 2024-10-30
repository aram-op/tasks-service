import {Component, input} from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: '../template/header.component.html',
  styleUrl: '../style/header.component.css'
})
export class HeaderComponent {
  headerText = input.required<string>();
}
