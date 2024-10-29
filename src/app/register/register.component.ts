import {Component, DestroyRef, ElementRef, inject, ViewChild} from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {User} from '../users/user.model';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    HeaderComponent,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  @ViewChild('registerFailed') messageElem!: ElementRef<HTMLParagraphElement>;

  registerForm = new FormGroup({
    email: new FormControl('', [
        Validators.email,
        Validators.required
      ]
    ),
    password: new FormControl('', [
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}'),
        Validators.required
      ]
    ),
    name: new FormControl('', [
        Validators.min(2),
        Validators.max(30),
        Validators.required
      ]
    ),
    surname: new FormControl('', [
        Validators.min(2),
        Validators.max(30),
        Validators.required
      ]
    ),
  });

  isButtonDisabled() {
    return !this.registerForm.valid;
  }

  onRegister() {
    const controls = this.registerForm.controls;
    const user: User = {
      email: controls.email.value!.valueOf(),
      password: controls.password.value!.valueOf(),
      name: controls.name.value!.valueOf(),
      surname: controls.surname.value!.valueOf()
    }

    const subscription = this.authService.register(user).subscribe({
      next: () => {
        this.messageElem.nativeElement.className = 'register-failed-message hidden'
        this.router.navigate(['login']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400) {
          this.messageElem.nativeElement.className = 'register-failed-message';
        }
        throw new Error(err.message);
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onCancel() {
    this.router.navigate(['login']);
  }

  emailIsInvalid() {
    return !this.registerForm.controls.email.valid && this.registerForm.controls.email.dirty;
  }

  passwordIsInvalid() {
    return !this.registerForm.controls.password.valid && this.registerForm.controls.password.dirty;
  }

  nameIsInvalid() {
    return !this.registerForm.controls.name.valid && this.registerForm.controls.name.dirty;
  }

  surnameIsInvalid() {
    return !this.registerForm.controls.surname.valid && this.registerForm.controls.surname.dirty;
  }
}
