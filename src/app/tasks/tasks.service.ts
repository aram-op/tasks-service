import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Task} from './task.model';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private http = inject(HttpClient);
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor() {
    this.http.get<Task[]>('http://localhost:3000/tasks').subscribe(tasks => {
      this.tasksSubject.next(tasks);
    });
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
