import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  formData = {
    nombre: '',
    apellidos: '',
    email: '',
    usuario: '',
    contrasena: '',
    foto: null as File | null
  };

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.formData.foto = input.files[0];
    }
  }

  onSubmit() {
    console.log('Formulario enviado:', this.formData);
  }
}