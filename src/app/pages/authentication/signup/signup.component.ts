import { Component, AfterViewInit, OnDestroy, inject, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

// 1. IMPORTACIÓN CORRECTA DE NPM (Elimina el 'declare var')
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
    // Al usar AfterViewInit, el elemento de formulario ya existe con total seguridad
    const inputDireccion = document.getElementById('direccion') as HTMLInputElement;

    if (inputDireccion && !this.pkInstance) {
      // 2. Inicializamos directamente usando la función importada de NPM
      this.pkInstance = placekitAutocomplete('pk_FzdoduYQyIfq0FaY+Ez9KCtgoITLWkpJT6UuNRw5z+U=', {
        target: inputDireccion,
        countries: ['es'],
        maxResults: 5,
      });

      // 3. Controlamos el evento dentro de la zona de Angular
      this.pkInstance.on('pick', (value: string, item: any) => {
        this.ngZone.run(() => {
          this.formData.direccion = value;

          // Forzamos la actualización de ngModel
          inputDireccion.dispatchEvent(new Event('input', { bubbles: true }));
        });
      });
    }
  }

  onSubmit() {
    console.log('Enviando signup:', this.formData);
    this.authService.signup(this.formData).subscribe({
      next: (resp) => {
        alert('Usuario creado correctamente');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en signup:', err);
        alert('Error al crear usuario');
      }
    });
  }
}