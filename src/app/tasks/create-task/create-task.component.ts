import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TasksService} from '../tasks.service';
import {Task, TaskStatus} from '../task.model';
import {Router} from '@angular/router';
import {HeaderComponent} from '../../header/header.component';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderComponent
  ],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent {
  private tasksService = inject(TasksService);
  private router = inject(Router);
  taskCreationForm: FormGroup;

  constructor() {
    this.taskCreationForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      dueDate: new FormControl('', Validators.required),
      priority: new FormControl('PRIORITY_LOW', Validators.required)
    });
  }

  isButtonDisabled() {
    return !this.taskCreationForm.valid;
  }

  onCreateTask() {
    let controls = this.taskCreationForm.controls;
    let newTaskObj = {
      title: controls['title'].value,
      description: controls['description'].value,
      dueDate: controls['dueDate'].value,
      priority: controls['priority'].value,
      status: TaskStatus.TODO
    }

    this.tasksService.addTask(newTaskObj).subscribe();
    this.router.navigate(['tasks']);
  }

  onCancel() {
    this.router.navigate(['tasks']);
  }
}
