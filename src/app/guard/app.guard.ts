import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {inject, Injectable} from '@angular/core';
import {AuthService} from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppGuard implements CanActivate {
  private router = inject(Router);
  private authService = inject(AuthService);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    const loggedIn = this.authService.isLoggedIn();

    if (loggedIn) {
      return true;
    }
    return this.router.createUrlTree(['login'],{queryParams: {returnUrl : state.url}});
  }
}
