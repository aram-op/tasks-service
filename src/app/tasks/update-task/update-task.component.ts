import {Component, DestroyRef, inject} from '@angular/core';
import {TasksService} from '../tasks.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Task, TaskPriority, TaskStatus} from '../task.model';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderComponent} from '../../header/header.component';
import {catchError, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-update-task',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderComponent
  ],
  templateUrl: './update-task.component.html',
  styleUrl: './update-task.component.css'
})
export class UpdateTaskComponent {
  private tasksService = inject(TasksService);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
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
            }
          );
        this.destroyRef.onDestroy(() => subscription.unsubscribe());
      } else {
        this.router.navigate(['not-found']).then(() => window.location.reload());
      }
    });
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

    const subscription = this.tasksService.updateTask(this.task.id, this.task).subscribe();
    this.destroyRef.onDestroy(() => subscription.unsubscribe());

    this.router.navigate(['tasks']).then(() => window.location.reload());
  }

  onDeleteTask() {
    const subscription = this.tasksService.deleteTask(this.task.id).subscribe();
    this.destroyRef.onDestroy(() => subscription.unsubscribe());

    this.router.navigate(['tasks']).then(() => window.location.reload());
  }

  initializeForm(task: Task) {
    this.taskUpdateForm = new FormGroup({
      title: new FormControl(task.title),
      description: new FormControl(task.description),
      dueDate: new FormControl(task.dueDate),
      priority: new FormControl(task.priority.valueOf()),
      status: new FormControl(task.status.valueOf()),
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
