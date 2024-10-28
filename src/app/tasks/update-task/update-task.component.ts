import {Component, inject} from '@angular/core';
import {TasksService} from '../tasks.service';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Task, TaskPriority, TaskStatus} from '../task.model';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderComponent} from '../../header/header.component';

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
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  taskUpdateForm;
  task!: Task;

  constructor() {
    this.taskUpdateForm = new FormGroup({
      title: new FormControl(''),
      description: new FormControl(''),
      dueDate: new FormControl(''),
      priority: new FormControl(''),
      status: new FormControl(''),
    });

    this.route.paramMap.subscribe(params => {
      const taskId = params.get('taskId');
      if (taskId) {
        this.tasksService.getTaskById(taskId).subscribe(
          task => {
            this.initializeForm(task);
            this.task = task;
          }
        )
      } else {
        //TODO throw an error and handle it somewhere
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
    this.task.status = <TaskStatus>controls.status.value!.valueOf();

    this.tasksService.updateTask(this.task.id, this.task).subscribe();
    this.router.navigate(['tasks']);
  }

  onDeleteTask() {
    this.tasksService.deleteTask(this.task.id).subscribe();
    this.router.navigate(['tasks']);
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
}
