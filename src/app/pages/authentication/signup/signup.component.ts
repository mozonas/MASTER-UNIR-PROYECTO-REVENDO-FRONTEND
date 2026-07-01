import { Component, AfterViewInit, OnDestroy, inject, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { HeaderMenuComponent } from "../../../shared/headers/header-menu/header-menu.component";

import placekitAutocomplete from '@placekit/autocomplete-js';
import Swal from 'sweetalert2';

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

  //mog 29/06/26 fix foto formulario
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file ?? null;
  }

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
    //mog 290626 fix foto form
    // Construimos FormData
    const form = new FormData();
    form.append('nombre', this.formData.nombre);
    form.append('apellidos', this.formData.apellidos);
    form.append('email', this.formData.email);
    form.append('usuario', this.formData.usuario);
    form.append('password', this.formData.password);
    form.append('fecha_nacimiento', this.formData.fecha_nacimiento);
    form.append('direccion', this.formData.direccion);

    if (this.selectedFile) {
      form.append('foto', this.selectedFile);
    }

    // Bloqueamos el registro si el usuario es menor de edad
    if (this.esMenorDeEdad()) {
      Swal.fire({
        title: 'Registro rechazado',
        text: 'Debes tener al menos 18 años para registrarte.',
        icon: 'warning',
        confirmButtonColor: '#dc3545'
      });
      return;
    }

    // Antes de enviar los datos, aseguramos que formData lleve lo que se ve en la caja de texto
    const inputDireccion = document.getElementById('direccion') as HTMLInputElement;
    if (inputDireccion && inputDireccion.value) {
      this.formData.direccion = inputDireccion.value;
    }

    console.log('Enviando signup verificado:', this.formData);

    /* this.authService.signup(this.formData).subscribe({
      next: (resp) => {
        alert('Usuario creado correctamente');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en signup:', err);
        alert('Error al crear usuario. Verifica los campos e inténtalo de nuevo.');
      }
    }); */

    // Enviar FormData por AuthService
    this.authService.signup(form).subscribe({
      next: (resp) => {
        Swal.fire({
          title: '¡Te has resgistrado correctamente!',
          text: 'Tu cuenta de usuario ha sido creada',
          icon:'success',
          confirmButtonColor: '#8cd86a',
          allowOutsideClick:false
        }).then((result)=>{
          if(result.isConfirmed){
            this.router.navigate(['/login']);
          }
        })
      },
      error: (err) => {
        console.error('Error en signup:', err);
        Swal.fire({
          title: 'Error',
          text:'Error al crear el usuario',
          icon: 'error',
          confirmButtonColor: '#dc3545'
        })
      }
    });
  }
}