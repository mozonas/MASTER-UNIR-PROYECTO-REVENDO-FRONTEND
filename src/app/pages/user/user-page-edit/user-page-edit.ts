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
  // 3. Inyecta el servicio Router
  private router = inject(Router);
  private fb = inject(FormBuilder);

  currentUser: Usuario = {
    id: 1,
    nombre: 'Alex',
    apellidos: 'García Pérez',
    email: 'info@domain.com',
    usuario: 'alex_ux_designer',
    foto: 'https://bootdey.com/img/Content/avatar/avatar7.png',
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
      foto: [this.currentUser.foto]
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

    // 4. Tras guardar, redirigimos al usuario a su perfil
    this.router.navigate(['/user-info']);
  }

  onCancelar(): void {
    // 5. Redirecciona a la ruta 'user-info' definida en Routes
    this.router.navigate(['/user-info']);
  }
}