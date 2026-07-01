import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent {
  private router = inject(Router);

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  private location = inject(Location);

  loading = signal(false);
  errorMessage = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.form.value;

    this.authService.login(email!, password!).subscribe({
      next: (resp) => {
        console.log('LOGIN OK =>', resp);
        this.loading.set(false);
        sessionStorage.setItem('token', resp.token);
        // Obtener rol desde el token
        const role = this.authService.getUserRole();

        console.log('ROL DECODIFICADO =>', role);
        // Redirección según rol
        switch (role) {
          //redireccionar al dashboard del administrador
          case 'ADMIN':
            this.router.navigate(['/admin/dashboard']);
            break;
          //redireccionar al dashboard de moderador
          case 'MODERADOR':
            this.router.navigate(['/moderation/panel']); //VCB - ruta modificada para redirigir a la pantalla principal de moderacion
            break;
          //redireccionar a la página de usuario que se decida, yo lo redireccionaría al listado de productos a vender
          default:
            this.router.navigate(['/home']);
            break;
        }
      },
      error: (err) => {
        if (err.status === 403) {
          //MOG 290626 -> implementación para userIsBlocked
          this.errorMessage.set('Tu cuenta ha sido bloqueada y está siendo investigada');
          return;
        }

        console.error('LOGIN ERROR =>', err);
        this.loading.set(false);
        this.errorMessage.set('Credenciales incorrectas');
      }
    });
  }

  // Método para volver atrás
  onBack() {
    this.location.back();
  }


}
