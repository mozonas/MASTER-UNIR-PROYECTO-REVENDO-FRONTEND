import { Component, AfterViewInit, OnDestroy, inject, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

import placekitAutocomplete from '@placekit/autocomplete-js';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
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
          // 1. Extraemos los metadatos desglosados de PlaceKit
          const calleYNumero = item.name || value;
          const codigoPostal = item.zipcode && item.zipcode.length > 0 ? item.zipcode[0] : '';
          const localidad = item.city || '';
          const pais = item.country || 'España';

          // 2. Construimos la cadena de texto larga e inequívoca
          let direccionCompleta = `${calleYNumero}`;
          if (codigoPostal || localidad) {
            direccionCompleta += `, ${codigoPostal} ${localidad}`.trim();
          }
          direccionCompleta += `, ${pais}`;
          direccionCompleta = direccionCompleta.replace(/,\s*,/g, ',').trim();

          // 3. Usamos setTimeout para ganarle la carrera a los eventos internos de PlaceKit
          setTimeout(() => {
            // Escribimos el valor formateado completo directamente en el cuadro de texto
            inputDireccion.value = direccionCompleta;

            // Sincronizamos nuestro objeto de datos
            this.formData.direccion = direccionCompleta;

            // Despierta a Angular avisándole de que el valor definitivo ya está en el input
            inputDireccion.dispatchEvent(new Event('input', { bubbles: true }));
            inputDireccion.dispatchEvent(new Event('change', { bubbles: true }));
          }, 0);
        });
      });
    }
  }

  onSubmit() {
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