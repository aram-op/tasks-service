import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from './user.model';
import {shareReplay} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);

  getUsers() {
    return this.http.get<User[]>('http://localhost:3000/users').pipe(shareReplay(1));
  }
}
