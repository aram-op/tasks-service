import {Component, inject, input} from '@angular/core';
import {Task, TaskPriority, TaskStatus} from '../model/task.model';
import {Router} from '@angular/router';
import {HeaderComponent} from './header.component';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    HeaderComponent,
    DatePipe
  ],
  templateUrl: '../template/task.component.html',
  styleUrl: '../style/task.component.css'
})
export class TaskComponent {
  private router = inject(Router);
  task = input.required<Task>();

  onEditTask() {
    this.router.navigate([`tasks/${this.task().id}/update`]).then(() => window.location.reload());
  }

  protected readonly TaskStatus = TaskStatus;
  protected readonly TaskPriority = TaskPriority;
}
