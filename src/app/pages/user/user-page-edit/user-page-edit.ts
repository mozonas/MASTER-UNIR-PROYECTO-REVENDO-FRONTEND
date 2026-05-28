import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  usuario: string;
  foto: string;
  biografia: string;
  ubicacion: string;
  created_at: string;
}

@Component({
  selector: 'app-user-page-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-page-edit.html',
  styleUrls: ['./user-page-edit.css']
})
export class UserPageEditComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Valores por defecto alineados con "Captura de pantalla 2026-05-28 a las 19.03.02.png"
  currentUser: Usuario = {
    id: 1,
    nombre: 'Alex',
    apellidos: 'García Pérez',
    email: 'info@domain.com',
    usuario: 'alex_ux_designer',
    foto: 'https://bootdey.com/img/Content/avatar/avatar7.png',
    biografia: 'Diseño y desarrollo servicios para clientes de todos los tamaños. Especializado en crear sitios web modernos, elegantes y tiendas online de alto impacto.',
    ubicacion: 'Madrid',
    created_at: '2026-01-15 10:30:00'
  };

  editForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.editForm = this.fb.group({
      nombre: [this.currentUser.nombre, [Validators.required, Validators.minLength(2)]],
      apellidos: [this.currentUser.apellidos, [Validators.required]],
      usuario: [this.currentUser.usuario, [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      email: [this.currentUser.email, [Validators.required, Validators.email]],
      foto: [this.currentUser.foto],
      biografia: [this.currentUser.biografia, [Validators.maxLength(300)]], // Validación opcional de longitud
      ubicacion: [this.currentUser.ubicacion]
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.editForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onGuardar(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const usuarioActualizado: Usuario = {
      ...this.currentUser,
      ...this.editForm.value
    };

    console.log('Guardando...', usuarioActualizado);
    
    // Aquí conectarías con el servicio (ej. UserService.update(usuarioActualizado)) 
    // para persistir los cambios y que la vista de información los pinte.

    this.router.navigate(['/user-info']);
  }

  onCancelar(): void {
    this.router.navigate(['/user-info']);
  }
}