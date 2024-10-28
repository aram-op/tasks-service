import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {TasksComponent} from './tasks/tasks.component';
import {CreateTaskComponent} from './tasks/create-task/create-task.component';
import {UpdateTaskComponent} from './tasks/update-task/update-task.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {AppGuard} from './app.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'tasks',
    component: TasksComponent,
    canActivate: [AppGuard]
  },
  {
    path: 'tasks/create',
    component: CreateTaskComponent,
    canActivate: [AppGuard],
  },
  {
    path: 'tasks/:taskId/update',
    component: UpdateTaskComponent,
    canActivate: [AppGuard]
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full'
  }
];
