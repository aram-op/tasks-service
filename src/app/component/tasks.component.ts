import {Component, DestroyRef, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {TasksService} from '../service/tasks.service';
import {Observable} from 'rxjs';
import {Task, TaskStatus} from '../model/task.model';
import {TaskComponent} from './task.component';
import {Router} from '@angular/router';
import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, transferArrayItem} from '@angular/cdk/drag-drop';
import {HeaderComponent} from './header.component';
import {AuthService} from '../service/auth.service';
import {User} from '../model/user.model';

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
  templateUrl: '../template/tasks.component.html',
  styleUrl: '../style/tasks.component.css'
})
export class TasksComponent implements OnInit {
  private tasksService = inject(TasksService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private authService = inject(AuthService);
  user: WritableSignal<User | undefined> = signal(undefined);
  tasks$!: Observable<Task[]>;
  completedTasks: Task[] = [];
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];

  ngOnInit() {
    this.tasks$ = this.tasksService.tasks$;

    const subscription = this.tasks$.subscribe(tasks => {
      this.completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED);
      this.todoTasks = tasks.filter(task => task.status === TaskStatus.TODO);
      this.inProgressTasks = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS);
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());

    this.setLoggedUser();
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
    const subscription = this.tasksService.updateTask(task.id!.valueOf(), task).subscribe();
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  setLoggedUser() {
    const subscription = this.authService.getLoggedUser().subscribe(
      user => this.user.set(user)
    );
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
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

  onLogout() {
    this.authService.logout();
    this.router.navigate(['login']).then(() => window.location.reload());
  }
}
