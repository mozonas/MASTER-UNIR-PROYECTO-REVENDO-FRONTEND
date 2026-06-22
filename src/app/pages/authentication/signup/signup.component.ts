import { Component, AfterViewInit, OnDestroy, inject, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { HeaderMenuComponent } from "../../../shared/headers/header-menu/header-menu.component";

import placekitAutocomplete from '@placekit/autocomplete-js';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderMenuComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements AfterViewInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  formData = {
    nombre: '',
    apellidos: '',
    email: '',
    usuario: '',
    password: '',
    foto: null as string | null,
    fecha_nacimiento: '',
    direccion: ''
  };

  private pkInstance: any = null;

  // Validación de mayoría de edad
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

  ngAfterViewInit(): void {
    this.initPlaceKit();
  }

  ngOnDestroy(): void {
    if (this.pkInstance && typeof this.pkInstance.destroy === 'function') {
      this.pkInstance.destroy();
    }
  }

  private initPlaceKit(): void {
    const inputDireccion = document.getElementById('direccion') as HTMLInputElement;

    if (inputDireccion && !this.pkInstance) {
      this.pkInstance = placekitAutocomplete('pk_FzdoduYQyIfq0FaY+Ez9KCtgoITLWkpJT6UuNRw5z+U=', {
        target: inputDireccion,
        countries: ['es'],
        maxResults: 5,
      });

      this.pkInstance.on('pick', (value: string, item: any) => {
        this.ngZone.run(() => {
          const calleYNumero = item.name || value;
          const codigoPostal = item.zipcode && item.zipcode.length > 0 ? item.zipcode[0] : '';
          const localidad = item.city || '';
          const pais = item.country || 'España';

          let direccionCompleta = `${calleYNumero}`;
          if (codigoPostal || localidad) {
            direccionCompleta += `, ${codigoPostal} ${localidad}`.trim();
          }
          direccionCompleta += `, ${pais}`;
          direccionCompleta = direccionCompleta.replace(/,\s*,/g, ',').trim();

          setTimeout(() => {
            inputDireccion.value = direccionCompleta;
            this.formData.direccion = direccionCompleta;
            inputDireccion.dispatchEvent(new Event('input', { bubbles: true }));
            inputDireccion.dispatchEvent(new Event('change', { bubbles: true }));
          }, 0);
        });
      });
    }
  }

  onSubmit() {
    // Bloqueamos el registro si el usuario es menor de edad
    if (this.esMenorDeEdad()) {
      alert('Debes tener al menos 18 años para registrarte.');
      return;
    }

    // Antes de enviar los datos, aseguramos que formData lleve lo que se ve en la caja de texto
    const inputDireccion = document.getElementById('direccion') as HTMLInputElement;
    if (inputDireccion && inputDireccion.value) {
      this.formData.direccion = inputDireccion.value;
    }

    console.log('Enviando signup verificado:', this.formData);

    this.authService.signup(this.formData).subscribe({
      next: (resp) => {
        alert('Usuario creado correctamente');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en signup:', err);
        alert('Error al crear usuario. Verifica los campos e inténtalo de nuevo.');
      }
    });
  }
}