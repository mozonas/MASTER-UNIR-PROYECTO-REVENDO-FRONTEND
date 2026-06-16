import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
//02062026
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { HeaderMenuComponent } from "../../../shared/headers/header-menu/header-menu.component";


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderMenuComponent],
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
    foto:  null as string | null, 
    fecha_nacimiento: '',
    direccion: ''
  };
  // no entiendo cómo queréis mandar un blog a la bbdd , en la nndd la columna foto es string, no un blob, así que no sé si queréis mandar la foto como base64 o qué, pero de momento lo dejo así, como string, y luego ya se verá cómo se manda la foto al backend
  // lo que hay que mandar es un string con la ruta de la foto, o un string con el nombre de la foto, o un string con el contenido de la foto en base64, o algo así, pero no un blob, porque en la bbdd la columna foto es string, no blob. De momento lo dejo como string, y luego ya se verá cómo se manda la foto al backend.
 /*
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.formData.foto = input.files[0];
    }
  }
*/
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

        console.log('➡️ err.error:', err.error);
        console.log('➡️ err.error.errors:', err.error?.errors);
        console.log('➡️ err.error.message:', err.error?.message);

        alert('Error al crear usuario');
      }
    });
  }
}