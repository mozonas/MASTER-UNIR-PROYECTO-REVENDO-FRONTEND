import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
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
    fechaNacimiento: '',
    foto: null as File | null,
    fotoUrl: ''
  };

  maxDate: string = this.calcularMaxDate();

  calcularMaxDate(): string {
    const hoy = new Date();
    hoy.setFullYear(hoy.getFullYear() - 18);
    return hoy.toISOString().split('T')[0];
  }

  esMenorDeEdad(): boolean {
    if (!this.formData.fechaNacimiento) return false;
    const fechaNac = new Date(this.formData.fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    return edad < 18;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.formData.foto = input.files[0];
    }
  }

  onSubmit() {
    if (this.esMenorDeEdad()) return;

    if (!this.formData.foto) {
      this.formData.fotoUrl = '/images/avatar_usuario.png';
    }

    console.log('Formulario enviado:', this.formData);
  }
}