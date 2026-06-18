import { Component, OnInit, inject, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../interfaces/user.interface';
import { ActivatedRoute } from '@angular/router';

// Importamos PlaceKit Autocomplete
import placekitAutocomplete from '@placekit/autocomplete-js';

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
  private route = inject(ActivatedRoute);

  isLoaded: boolean = false;
  editForm!: FormGroup;
  currentUser!: Usuario;

  fileSelected: File | null = null;
  fotoPreview: string | null = null;
  userIdParaEditar: number | null = null;

  // Guardará la instancia para evitar inicializaciones duplicadas
  private pkInstance: any = null;

  ngOnInit(): void {
    this.initForm();
    this.resolverUserId();
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

  private resolverUserId(): void {
    const idRuta = this.route.snapshot.paramMap.get('id');
    if (idRuta) {
      this.userIdParaEditar = Number(idRuta);
    } else {
      this.userIdParaEditar = this.authService.getUserId();
    }
  }

  private cargarDatosUsuario(): void {
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

          // Inicializamos PlaceKit justo después de que la vista se haya cargado
          this.initPlaceKit();
        }
      },
      error: (err) => console.error('❌ Error al recuperar los datos del usuario:', err)
    });
  }

  private initPlaceKit(): void {
    // Timeout mínimo para asegurar que el DOM con @if(isLoaded) ya se ha renderizado por completo
    setTimeout(() => {
      const inputDireccion = document.getElementById('direccion');

      if (inputDireccion && !this.pkInstance) {
        this.pkInstance = placekitAutocomplete('pk_FzdoduYQyIfq0FaY+Ez9KCtgoITLWkpJT6UuNRw5z+U=', {
          target: '#direccion',
          countries: ['es'], // Opcional: limita la búsqueda (ej: 'es' para España)
          maxResults: 5,
        });

        // Evento cuando el usuario selecciona una dirección de la lista
        this.pkInstance.on('pick', (value: string, item: any) => {
          this.editForm.patchValue({
            direccion: value // Sincroniza el valor seleccionado con el FormReactive
          });
          this.editForm.get('direccion')?.markAsDirty();
        });
      }
    }, 50);
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileSelected = file;
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

    if (this.fileSelected) {
      formData.append('foto', this.fileSelected, this.fileSelected.name);
    }

    this.userService.updatePerfilUsuario(this.currentUser.id, formData as unknown as Partial<Usuario>).subscribe({
      next: (response) => {
        if (this.route.snapshot.paramMap.get('id')) {
          this.router.navigate(['/admin/users']);
        } else {
          this.router.navigate(['/user-info']);
        }
      },
      error: (err) => {
        console.error('❌ Error al guardar los cambios en el servidor:', err);
        alert('Hubo un error al intentar guardar los cambios del perfil.');
      }
    });
  }

  onCancelar(): void {
    if (this.route.snapshot.paramMap.get('id')) {
      this.router.navigate(['/admin/users']);
    } else {
      this.router.navigate(['/user-info']);
    }
  }
}