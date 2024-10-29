import {DestroyRef, inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Task} from './task.model';
import {BehaviorSubject, map} from 'rxjs';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private http = inject(HttpClient);
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor() {
    this.setUsersTasks();
  }

  setUsersTasks() {
    const userId = this.authService.getLoggedUserId();

    const subscription = this.http.get<Task[]>('http://localhost:3000/tasks')
      .pipe(
        map(tasks => tasks.filter(
            task => task.userId === userId
          )
        )
      )
      .subscribe(
        tasks => {
          this.tasksSubject.next(tasks);
        }
      );
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  getTaskById(id: string) {
    return this.http.get<Task>('http://localhost:3000/tasks/' + id);
  }

  addTask(task: Object) {
    return this.http.post('http://localhost:3000/tasks', task);
  }

  updateTask(id: string, task: Object) {
    return this.http.put('http://localhost:3000/tasks/' + id, task);
  }

  deleteTask(id: string) {
    return this.http.delete('http://localhost:3000/tasks/' + id);
  }
}
