import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, Usuario } from '../../../services/user.service'; // Ajusta la ruta si es necesario

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
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  isLoaded: boolean = false;
  editForm!: FormGroup;

  currentUser: Usuario = {
    id: 34, // ID fijo temporalmente
    nombre: '',
    apellidos: '',
    email: '',
    usuario: '',
    foto: null,
    perfil: 'USUARIO',
    fecha_nacimiento: null,
    created_at: ''
  };

  ngOnInit(): void {
    this.initForm();
    this.cargarDatosUsuario();
  }

  private initForm(): void {
    this.editForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      usuario: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_.]+$/)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      foto: [null],
      perfil: ['USUARIO', [Validators.required]],
      fecha_nacimiento: [null]
    });
  }

  private cargarDatosUsuario(): void {
    console.log('🔄 Cargando datos del usuario 34 para edición...');
    this.userService.getPerfilUsuario(this.currentUser.id).subscribe({
      next: (userData: any) => {
        const userObj = Array.isArray(userData) ? userData[0] : userData;
        
        if (userObj) {
          this.currentUser = userObj;

          // Formateamos la fecha a YYYY-MM-DD para que el input type="date" la entienda perfectamente
          let fechaFormateada = null;
          if (this.currentUser.fecha_nacimiento) {
            fechaFormateada = new Date(this.currentUser.fecha_nacimiento).toISOString().split('T')[0];
          }

          // Rellenamos el formulario con los valores reales de la DB
          this.editForm.patchValue({
            nombre: this.currentUser.nombre,
            apellidos: this.currentUser.apellidos,
            usuario: this.currentUser.usuario,
            email: this.currentUser.email,
            foto: this.currentUser.foto,
            perfil: this.currentUser.perfil,
            fecha_nacimiento: fechaFormateada
          });

          this.isLoaded = true;
          this.cdr.detectChanges();
          console.log('✅ Formulario cargado con éxito.');
        }
      },
      error: (err) => console.error('❌ Error al recuperar usuario:', err)
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

    // Fusionamos los datos viejos con los nuevos del formulario
    const usuarioActualizado: Partial<Usuario> = {
      ...this.editForm.value
    };

    console.log('🚀 Enviando actualización al backend...', usuarioActualizado);

    this.userService.updatePerfilUsuario(this.currentUser.id, usuarioActualizado).subscribe({
      next: (response) => {
        console.log('🎉 Backend dice:', response.message);
        // Redirigimos de vuelta a la vista de información para ver los cambios
        this.router.navigate(['/user-info']);
      },
      error: (err) => {
        console.error('❌ Error al guardar los cambios en el servidor:', err);
        alert('Hubo un error al guardar los cambios.');
      }
    });
  }

  onCancelar(): void {
    this.router.navigate(['/user-info']);
  }
}