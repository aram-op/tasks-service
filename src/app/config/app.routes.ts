import { Routes } from '@angular/router';
import {LoginComponent} from '../component/login.component';
import {TasksComponent} from '../component/tasks.component';
import {CreateTaskComponent} from '../component/create-task.component';
import {UpdateTaskComponent} from '../component/update-task.component';
import {NotFoundComponent} from '../component/not-found.component';
import {AppGuard} from '../guard/app.guard';
import {RegisterComponent} from '../component/register.component';

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
    path: 'register',
    component: RegisterComponent
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
