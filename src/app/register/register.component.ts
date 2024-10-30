import {Component, DestroyRef, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {User} from '../users/user.model';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {RegisterFormModel} from './register-form.model';

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
export class RegisterComponent implements OnInit {
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

  ngOnInit() {
    const storageItem = localStorage.getItem('registerFormData');

    if (storageItem) {
      const user: User = JSON.parse(storageItem);

      const controls = this.registerForm.controls;

      if (user.email) controls.email.setValue(user.email);
      if (user.password) controls.password.setValue(user.password);
      if (user.name) controls.name.setValue(user.name);
      if (user.surname) controls.surname.setValue(user.surname);
    }

    const subscription = this.registerForm.valueChanges.subscribe({
      next: (data: Partial<RegisterFormModel>) => {
        this.saveFormData(data);
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  saveFormData(data: Partial<RegisterFormModel>) {
    const user: User = {email: '', password: '', name: '', surname: ''};
    if (data.email) user.email = data.email;
    if (data.password) user.password = data.password;
    if (data.name) user.name = data.name;
    if (data.surname) user.surname = data.surname;

    localStorage.setItem('registerFormData', JSON.stringify(user));
  }

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
