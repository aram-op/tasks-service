import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';
import moment from 'moment';
import {LoginResponseModel} from './login-response.model';
import {User} from '../users/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  register(user: User) {
    return this.http.post('http://localhost:3000/register', user);
  }

  login(email: string, password: string) {
    return this.http.post<LoginResponseModel>('http://localhost:3000/login', {email, password})
      .pipe(tap(res => this.setSession(res)));
  }

  private setSession(authResult: { accessToken: string }) {
    const expiresAt = moment().add(3600, 'second');

    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.clear();
  }

  public isLoggedIn() {
    if (!this.getExpiration()) {
      return false;
    }
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');

    if (!expiration) {
      return null;
    }
    const expiresAt = JSON.parse(expiration.valueOf());
    return moment(expiresAt);
  }

  getLoggedUser() {
    const arrayToken = localStorage.getItem('accessToken')!.valueOf().split('.');
    const tokenPayload = JSON.parse(atob(arrayToken[1]))

    return this.http.get<User>('http://localhost:3000/users/' + tokenPayload.sub);
  }

  getLoggedUserId() {
    const arrayToken = localStorage.getItem('accessToken')!.valueOf().split('.');
    const tokenPayload = JSON.parse(atob(arrayToken[1]));

    return tokenPayload.sub;
  }
}
