import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../interfaces/user.interface';
// mog 140620226 -> edición usuario como admin
import { ActivatedRoute } from '@angular/router';


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

  // Guardará el archivo binario seleccionado
  fileSelected: File | null = null;
  // Guardará la URL en base64 para previsualizar la foto al instante
  fotoPreview: string | null = null;

 ngOnInit(): void {
  this.initForm();
  this.resolverUserId();   // ✔ primero obtenemos el ID correcto
  this.cargarDatosUsuario(); // ✔ ahora sí podemos cargar datos
}


  private initForm(): void {
    this.editForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      usuario: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_.]+$/)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      foto: [null], // Aquí se guardará el string que viene del backend
      perfil: ['USUARIO', [Validators.required]],
      fecha_nacimiento: [null],
      direccion: ['', [Validators.maxLength(200)]],
      descripcion: ['', [Validators.maxLength(500)]]
    });
  }

  private cargarDatosUsuario(): void {
    //const userIdParaEditar = this.authService.getUserId();
    //this.userService.getPerfilUsuario(this.userIdParaEditar)

    const userIdParaEditar = this.userIdParaEditar;
    if (!userIdParaEditar) {
      console.error('❌ No se encontró un ID de usuario válido en la sesión actual.');
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getPerfilUsuario(userIdParaEditar).subscribe({
      next: (userData: any) => {
        const userObj = Array.isArray(userData) ? userData[0] : userData;

        if (userObj) {
          this.currentUser = userObj;

          let fechaFormateada = null;
          if (this.currentUser.fecha_nacimiento) {
            fechaFormateada = new Date(this.currentUser.fecha_nacimiento).toISOString().split('T')[0];
          }

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
        }
      },
      error: (err) => console.error('❌ Error al recuperar los datos del usuario:', err)
    });
  }

  // 📸 Captura el archivo binario y genera la previsualización en pantalla
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileSelected = file;

      // FileReader nos ayuda a renderizar la imagen antes de subirla al backend
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPreview = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
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

    // 📦 Importante: Usamos FormData para empaquetar archivos binarios y textos juntos
    const formData = new FormData();
    formData.append('nombre', formValues.nombre);
    formData.append('apellidos', formValues.apellidos);
    formData.append('usuario', formValues.usuario);
    formData.append('email', formValues.email);
    formData.append('perfil', formValues.perfil);

    if (formValues.fecha_nacimiento) {
      formData.append('fecha_nacimiento', formValues.fecha_nacimiento);
    }
    formData.append('direccion', formValues.direccion || '');
    formData.append('descripcion', formValues.descripcion || '');
    formData.append('password', (this.currentUser as any).password || '');

    // Si seleccionó una foto nueva, adjuntamos el archivo binario real
    if (this.fileSelected) {
      formData.append('foto', this.fileSelected, this.fileSelected.name);
    }

    console.log('🚀 Enviando FormData con archivo Multer al backend...');

    // Cast FormData to any/Partial<Usuario> to satisfy the service typing when sending multipart data
    this.userService.updatePerfilUsuario(this.currentUser.id, formData as unknown as Partial<Usuario>).subscribe({
      next: (response) => {
        if (this.route.snapshot.paramMap.get('id')) {
        this.router.navigate(['/admin/users']);   // ← admin vuelve al listado
        } else {
          this.router.navigate(['/user-info']);      // ← usuario normal vuelve a su perfil
        }
      },
      error: (err) => {
        console.error('❌ Error al guardar los cambios en el servidor:', err);
        alert('Hubo un error al intentar guardar los cambios del perfil.');
      }
    });
  }

  // mog 14062026 -> cambiado para que si editas como admin, vuelva al listado de usuarios, y si editas como usuario normal, vuelva a tu perfil
onCancelar(): void {
  if (this.route.snapshot.paramMap.get('id')) {
    this.router.navigate(['/admin/users']);   // ← volver al listado admin
  } else {
    this.router.navigate(['/user-info']);      // ← volver al perfil normal
  }
}


  //mog 14062026 -< gestion de usuario como admin
  private route = inject(ActivatedRoute);

  userIdParaEditar: number | null = null;

  private resolverUserId(): void {
  const idRuta = this.route.snapshot.paramMap.get('id');

  if (idRuta) {
    this.userIdParaEditar = Number(idRuta);   // ← modo admin
  } else {
    this.userIdParaEditar = this.authService.getUserId();  // ← modo usuario normal
  }
  }

}