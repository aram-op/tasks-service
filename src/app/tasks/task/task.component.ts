import {Component, inject, input} from '@angular/core';
import {Task, TaskPriority, TaskStatus} from '../task.model';
import {Router} from '@angular/router';
import {HeaderComponent} from '../../header/header.component';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    HeaderComponent
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  private router = inject(Router);
  task = input.required<Task>();

  onEditTask() {
    this.router.navigate([`tasks/${this.task().id}/update`]);
  }

  protected readonly TaskStatus = TaskStatus;
  protected readonly TaskPriority = TaskPriority;
}
