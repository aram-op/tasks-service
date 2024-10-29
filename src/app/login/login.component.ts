import {Component, DestroyRef, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../auth/auth.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {HeaderComponent} from '../header/header.component';
import {HttpErrorResponse} from '@angular/common/http';
import {LoginFormModel} from './login-form.model';

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
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  @ViewChild('loginFailed') messageElem!: ElementRef<HTMLParagraphElement>;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}'), Validators.required]),
  });


  ngOnInit() {
    const dataJson = localStorage.getItem('data');

    if (dataJson) {
      const data: { email: string, password: string } = JSON.parse(dataJson);

      const controls = this.loginForm.controls;

      if (data.email) controls.email.setValue(data.email);
      if (data.password) controls.password.setValue(data.password);
    }

    const subscription = this.loginForm.valueChanges.subscribe({
        next: (data: Partial<LoginFormModel>) => {
          this.saveFormData(data);
        }
      }
    );
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  saveFormData(data: Partial<LoginFormModel>) {
    let obj = {email: '', password: ''};
    if (data.email) obj.email = data.email;
    if (data.password) obj.password = data.password;
  }

  isButtonDisabled() {
    return !this.loginForm.valid;
  }

  onLogin() {
    const email: string = this.loginForm.controls.email.value!.valueOf();
    const password: string = this.loginForm.controls.password.value!.valueOf();

    const subscription = this.authService.login(email, password).subscribe({
      next: () => {
        this.navigateBack();
        this.messageElem.nativeElement.className = 'login-failed-message hidden';
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400) {
          this.messageElem.nativeElement.className = 'login-failed-message';
        }
        throw new Error(err.message);
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  navigateBack() {
    const subscription = this.route.queryParams.subscribe({
      next: params => {
        if (params['returnUrl']) {
          this.router.navigate([params['returnUrl']]);
        } else {
          this.router.navigate(['tasks']).then(() => window.location.reload());
        }
      },
      error: err => console.log(err)
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
