import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginComponent} from './login.component';
import {TasksComponent} from './tasks.component';
import {CreateTaskComponent} from './create-task.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, TasksComponent, CreateTaskComponent],
  templateUrl: '../template/app.component.html',
  styleUrl: '../style/app.component.css'
})
export class AppComponent {
  title = 'task-management-service';
}
