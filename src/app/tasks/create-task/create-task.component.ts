import {Component, DestroyRef, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TasksService} from '../tasks.service';
import {TaskStatus} from '../task.model';
import {Router} from '@angular/router';
import {HeaderComponent} from '../../header/header.component';
import {AuthService} from '../../auth/auth.service';

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
