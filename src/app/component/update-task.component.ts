import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {TasksService} from '../service/tasks.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Task, TaskPriority, TaskStatus} from '../model/task.model';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderComponent} from './header.component';
import {catchError, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {UpdateTaskFormModel} from '../model/update-task-form.model';

@Component({
  selector: 'app-update-task',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderComponent
  ],
  templateUrl: '../template/update-task.component.html',
  styleUrl: '../style/update-task.component.css'
})
export class UpdateTaskComponent implements OnInit {
  private tasksService = inject(TasksService);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  currentDate = new Date().toISOString().split('T')[0];

  taskUpdateForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    dueDate: new FormControl('', Validators.pattern('^\\d{4}\\-(0?[1-9]|1[012])\\-(0?[1-9]|[12][0-9]|3[01])$')),
    priority: new FormControl(''),
    status: new FormControl(''),
  });
  task!: Task;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const taskId = params.get('taskId');
      if (taskId && taskId.trim().length > 0) {

        const subscription = this.tasksService.getTaskById(taskId)
          .pipe(
            catchError(error => this.handleError(error, this.router)))
          .subscribe(
            task => {
              this.initializeForm(task);
              this.task = task;
              this.trackFormDataChanges();
            }
          );
        this.destroyRef.onDestroy(() => subscription.unsubscribe());
      } else {
        this.router.navigate(['not-found']).then(() => window.location.reload());
      }
    });

    this.destroyRef.onDestroy(() => localStorage.removeItem('updateTaskFormData'));
  }

  trackFormDataChanges() {
    const taskJson = localStorage.getItem('updateTaskFormData');

    if (taskJson) {
      const task: Task = JSON.parse(taskJson);
      const controls = this.taskUpdateForm.controls;

      if (task.title) controls.title.setValue(task.title);
      if (task.description) controls.description.setValue(task.description);
      if (task.dueDate) controls.dueDate.setValue(task.dueDate);
      if (task.priority) controls.priority.setValue(task.priority);
      if (task.status) controls.status.setValue(task.status);
    }

    const subscription = this.taskUpdateForm.valueChanges.subscribe({
      next: (data: Partial<UpdateTaskFormModel>) => {
        this.saveFormData(data);
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  saveFormData(data: Partial<UpdateTaskFormModel>) {
    const task: Task = {
      title: '',
      description: '',
      priority: TaskPriority.LOW,
      dueDate: '',
      status: TaskStatus.TODO
    };

    if (data.title) task.title = data.title;
    if (data.description) task.description = data.description;
    if (data.dueDate) task.dueDate = data.dueDate;
    if (data.status) {
      switch (data.status) {
        case 'STATUS_TODO' :
          task.status = TaskStatus.TODO;
          break;
        case 'STATUS_IN_PROGRESS' :
          task.status = TaskStatus.IN_PROGRESS;
          break;
        case 'STATUS_COMPLETED' :
          task.status = TaskStatus.COMPLETED;
          break;
      }
    }
    if (data.priority) {
      switch (data.priority) {
        case 'PRIORITY_LOW' :
          task.priority = TaskPriority.LOW;
          break;
        case 'PRIORITY_MEDIUM' :
          task.priority = TaskPriority.MEDIUM;
          break;
        case 'PRIORITY_HIGH' :
          task.priority = TaskPriority.HIGH;
          break;
        case 'PRIORITY_CRITICAL':
          task.priority = TaskPriority.CRITICAL;
          break;
      }
    }
    localStorage.setItem('updateTaskFormData', JSON.stringify(task));
  }

  isButtonDisabled() {
    return !this.taskUpdateForm.dirty;
  }

  onUpdateTask() {
    let controls = this.taskUpdateForm.controls;

    this.task.title = controls.title.value!.valueOf();
    this.task.description = controls.description.value!.valueOf();
    this.task.dueDate = controls.dueDate.value!.valueOf();
    this.task.priority = <TaskPriority>controls.priority.value!.valueOf();

    const status = <TaskStatus>controls.status.value!.valueOf();

    if (this.task.status === TaskStatus.COMPLETED) {
      this.task.status = TaskStatus.COMPLETED;
    } else if (this.task.status === TaskStatus.IN_PROGRESS && status === 'STATUS_TODO') {
      this.task.status = TaskStatus.IN_PROGRESS;
    } else {
      this.task.status = status;
    }

    const subscription = this.tasksService.updateTask(this.task.id!.valueOf(), this.task).subscribe();
    this.destroyRef.onDestroy(() => subscription.unsubscribe());

    this.router.navigate(['tasks']).then(() => window.location.reload());
  }

  onDeleteTask() {
    const subscription = this.tasksService.deleteTask(this.task.id!.valueOf()).subscribe();
    this.destroyRef.onDestroy(() => subscription.unsubscribe());

    this.router.navigate(['tasks']).then(() => window.location.reload());
  }

  initializeForm(task: Task) {
    this.taskUpdateForm = new FormGroup({
      title: new FormControl(task.title),
      description: new FormControl(task.description),
      dueDate: new FormControl(task.dueDate),
      priority: new FormControl(task.priority.valueOf()),
      status: new FormControl(task.status!.valueOf()),
    });
  }

  handleError(error: HttpErrorResponse, router: Router) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else if (error.status === 404) {
      router.navigate(['not-found']).then(() => window.location.reload());
      return throwError(() => new Error('There is no task with specified id'));
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Please try again later'));
  }
}
