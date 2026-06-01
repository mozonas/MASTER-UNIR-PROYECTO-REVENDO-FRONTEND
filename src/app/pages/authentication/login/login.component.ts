import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import {signal} from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent {
private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loading = signal(false);
  errorMessage = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.form.value;

    this.authService.login(email!, password!).subscribe({
      next: (resp) => {
        console.log('LOGIN OK =>', resp);
        this.loading.set(false);
        sessionStorage.setItem('token', resp.token);
      },
      error: (err) => {
        console.error('LOGIN ERROR =>', err);
        this.loading.set(false);
        this.errorMessage.set('Credenciales incorrectas');
      }
    });
  }

  
}
