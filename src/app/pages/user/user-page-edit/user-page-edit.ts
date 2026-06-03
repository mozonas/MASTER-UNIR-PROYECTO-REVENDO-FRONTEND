import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, Usuario } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

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
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  isLoaded: boolean = false;
  editForm!: FormGroup;

  currentUser!: Usuario;

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
      fecha_nacimiento: [null],
      direccion: ['', [Validators.maxLength(200)]],
      descripcion: ['', [Validators.maxLength(500)]]
    });
  }

  private cargarDatosUsuario(): void {
    const userIdParaEditar = this.authService.getUserId();

    if (!userIdParaEditar) {
      console.error('❌ No se encontró un ID de usuario válido en la sesión actual.');
      this.router.navigate(['/login']);
      return;
    }

    console.log(`🔄 Cargando datos del usuario ID: ${userIdParaEditar} para edición...`);

    this.userService.getPerfilUsuario(userIdParaEditar).subscribe({
      next: (userData: any) => {
        const userObj = Array.isArray(userData) ? userData[0] : userData;

        if (userObj) {
          this.currentUser = userObj;

          let fechaFormateada = null;
          if (this.currentUser.fecha_nacimiento) {
            fechaFormateada = new Date(this.currentUser.fecha_nacimiento).toISOString().split('T')[0];
          }

          // Rellenamos correctamente con lo que venga de la BD
          this.editForm.patchValue({
            nombre: this.currentUser.nombre,
            apellidos: this.currentUser.apellidos,
            usuario: this.currentUser.usuario,
            email: this.currentUser.email,
            foto: this.currentUser.foto,
            perfil: this.currentUser.perfil,
            fecha_nacimiento: fechaFormateada,
            direccion: this.currentUser.direccion || '',
            descripcion: this.currentUser.descripcion || ''
          });

          this.isLoaded = true;
          this.cdr.detectChanges();
          console.log('✅ Formulario de edición inicializado con éxito.');
        } else {
          console.warn('⚠️ El backend no devolvió datos para este ID de usuario.');
        }
      },
      error: (err) => console.error('❌ Error al recuperar los datos del usuario:', err)
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

    const formValues = this.editForm.value;

    const usuarioActualizado = {
      nombre: formValues.nombre,
      apellidos: formValues.apellidos,
      usuario: formValues.usuario,
      email: formValues.email,
      foto: formValues.foto !== undefined ? formValues.foto : (this.currentUser.foto || null),
      direccion: formValues.direccion !== undefined ? formValues.direccion : (this.currentUser.direccion || null),
      descripcion: formValues.descripcion !== undefined ? formValues.descripcion : (this.currentUser.descripcion || null),
      fecha_nacimiento: formValues.fecha_nacimiento || null,
      password: (this.currentUser as any).password || ''
    };

    console.log('🚀 Enviando actualización limpia al backend...', usuarioActualizado);

    this.userService.updatePerfilUsuario(this.currentUser.id, usuarioActualizado).subscribe({
      next: (response) => {
        console.log('🎉 Backend dice:', response.message);
        this.router.navigate(['/user-info']);
      },
      error: (err) => {
        console.error('❌ Error al guardar los cambios en el servidor:', err);
        alert('Hubo un error al intentar guardar los cambios del perfil en la base de datos.');
      }
    });
  }

  onCancelar(): void {
    this.router.navigate(['/user-info']);
  }
}