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

  maxDate: string = this.calcularMaxDate();

  calcularMaxDate(): string {
    const hoy = new Date();
    hoy.setFullYear(hoy.getFullYear() - 18);
    return hoy.toISOString().split('T')[0];
  }

  esMenorDeEdad(): boolean {
    if (!this.formData.fecha_nacimiento) return false;
    const fechaNac = new Date(this.formData.fecha_nacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    return edad < 18;
  }

  onSubmit() {

    if (this.esMenorDeEdad()) {
      alert('Debes tener al menos 18 años para registrarte.');
      return;
    }

   console.log('Enviando signup:', this.formData);

    this.authService.signup(this.formData).subscribe({
      next: (resp) => {
        console.log('Signup OK:', resp);
        alert('Usuario creado correctamente');
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
