import {Component, inject, OnInit} from '@angular/core';
import {TasksService} from './tasks.service';
import {Observable} from 'rxjs';
import {Task, TaskStatus} from './task.model';
import {TaskComponent} from './task/task.component';
import {Router} from '@angular/router';
import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, transferArrayItem} from '@angular/cdk/drag-drop';
import {HeaderComponent} from '../header/header.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    TaskComponent,
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    HeaderComponent
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {
  private tasksService = inject(TasksService);
  private router = inject(Router);
  tasks$!: Observable<Task[]>;
  completedTasks: Task[] = [];
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];

  ngOnInit() {
    this.tasks$ = this.tasksService.tasks$;

    this.tasks$.subscribe(tasks => {
      this.completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED);
      this.todoTasks = tasks.filter(task => task.status === TaskStatus.TODO);
      this.inProgressTasks = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS);
    });
  }

  onCreateTask() {
    this.router.navigate(['tasks/create']);
  }

  drop(event: CdkDragDrop<Task[]>) {
    const task = event.item.data as Task;
    const containerId = event.container.id;

    if (event.previousContainer === event.container) {
      return;
    }

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    switch (containerId) {
      case 'in-progress':
        task.status = TaskStatus.IN_PROGRESS;
        break;
      case 'completed' :
        task.status = TaskStatus.COMPLETED;
        break;
    }
    this.tasksService.updateTask(task.id, task).subscribe();
  }

  noReturnPredicate() {
    return false;
  }

  todoPredicate(item: CdkDrag<Task>) {
    return item.data.status === TaskStatus.TODO;
  }

  todoOrInProgressPredicate(item: CdkDrag<Task>) {
    return item.data.status === TaskStatus.TODO || item.data.status === TaskStatus.IN_PROGRESS;
  }
}
