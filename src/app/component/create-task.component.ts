import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TasksService} from '../service/tasks.service';
import {Task, TaskPriority, TaskStatus} from '../model/task.model';
import {Router} from '@angular/router';
import {HeaderComponent} from './header.component';
import {AuthService} from '../service/auth.service';
import {CreateTaskFormModel} from '../model/create-task-form.model';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderComponent
  ],
  templateUrl: '../template/create-task.component.html',
  styleUrl: '../style/create-task.component.css'
})
export class CreateTaskComponent implements OnInit {
  private tasksService = inject(TasksService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  currentDate = new Date().toISOString().split('T')[0];

  taskCreationForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    dueDate: new FormControl('', [Validators.required, Validators.pattern('^\\d{4}\\-(0?[1-9]|1[012])\\-(0?[1-9]|[12][0-9]|3[01])$')]),
    priority: new FormControl('PRIORITY_LOW', Validators.required)
  });

  ngOnInit() {
    const taskJson = localStorage.getItem('createTaskFormData');

    if (taskJson) {
      const task: Task = JSON.parse(taskJson);
      const controls = this.taskCreationForm.controls;

      if (task.title) controls.title.setValue(task.title);
      if (task.description) controls.description.setValue(task.description);
      if (task.dueDate) controls.dueDate.setValue(task.dueDate);
      if (task.priority) controls.priority.setValue(task.priority);
    }

    const subscription = this.taskCreationForm.valueChanges.subscribe({
      next: (data: Partial<CreateTaskFormModel>) => {
        this.saveFormData(data);
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  saveFormData(data: Partial<CreateTaskFormModel>) {
    const task: Task = {title: '', description: '', priority: TaskPriority.LOW, dueDate: ''};

    if (data.title) task.title = data.title;
    if (data.description) task.description = data.description;
    if (data.dueDate) task.dueDate = data.dueDate;
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
    localStorage.setItem('createTaskFormData', JSON.stringify(task));
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
      status: TaskStatus.TODO,
      userId: this.authService.getLoggedUserId()
    }

    const subscription = this.tasksService.addTask(newTaskObj).subscribe();
    this.destroyRef.onDestroy(() => subscription.unsubscribe());

    this.router.navigate(['tasks']).then(() => window.location.reload());
  }

  onCancel() {
    this.router.navigate(['tasks']).then(() => window.location.reload());
  }
}
