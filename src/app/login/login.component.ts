import {Component, DestroyRef, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../auth/auth.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {HeaderComponent} from '../header/header.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}'), Validators.required]),
  });

  isButtonDisabled() {
    return !this.loginForm.valid;
  }

  onLogin() {
    const email: string = this.loginForm.controls.email.value!.valueOf();
    const password: string = this.loginForm.controls.password.value!.valueOf();

    const subscription = this.authService.login(email, password).subscribe(() => this.navigateBack());
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  navigateBack() {
    this.route.queryParams.subscribe(params => {
      if (params['returnUrl']) {
        this.router.navigate([params['returnUrl']]);
      } else {
        this.router.navigate(['tasks']).then(() => window.location.reload());
      }
    });
  }
}
