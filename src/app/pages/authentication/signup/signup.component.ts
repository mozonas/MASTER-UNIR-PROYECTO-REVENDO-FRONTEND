import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
//02062026
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  formData = {
    nombre: '',
    apellidos: '',
    email: '',
    usuario: '',
    password: '',
    foto: null as File | null,
    fecha_nacimiento: '',
    direccion: ''
  };

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.formData.foto = input.files[0];
    }
  }

  onSubmit() {
   console.log('Enviando signup:', this.formData);

    this.authService.signup(this.formData).subscribe({
      next: (resp) => {
        console.log('Signup OK:', resp);
        alert('Usuario creado correctamente');
        // Redirigir al login
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en signup:', err);
        alert('Error al crear usuario');
      }
    });
  }
}