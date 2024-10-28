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
    this.loadTasks();
  }

  loadTasks() {
    this.http.get<Task[]>('http://localhost:3000/tasks').subscribe(tasks => {
      this.tasksSubject.next(tasks);
    });
  }

  getTaskById(id: string) {
    return this.http.get<Task>('http://localhost:3000/tasks/' + id);
  }

  addTask(task: Object) {
    let result = this.http.post('http://localhost:3000/tasks', task);
    this.loadTasks();
    return result;
  }

  updateTask(id: string, task: Object) {
    let result = this.http.put('http://localhost:3000/tasks/' + id, task);
    this.loadTasks();
    return result;
  }

  deleteTask(id: string) {
    let result = this.http.delete('http://localhost:3000/tasks/' + id);
    this.loadTasks();
    return result;
  }
}
