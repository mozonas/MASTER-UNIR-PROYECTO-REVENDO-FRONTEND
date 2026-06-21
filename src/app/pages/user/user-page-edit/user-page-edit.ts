import { Component, OnInit, inject, ChangeDetectorRef, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../interfaces/user.interface';

// Importamos PlaceKit Autocomplete
import placekitAutocomplete from '@placekit/autocomplete-js';

@Component({
  selector: 'app-user-page-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-page-edit.html',
  styleUrls: ['./user-page-edit.css']
})
export class UserPageEditComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private ngZone = inject(NgZone);

  isLoaded: boolean = false;
  editForm!: FormGroup;
  currentUser!: Usuario;

  fileSelected: File | null = null;
  fotoPreview: string | null = null;
  userIdParaEditar: number | null = null;

  // Instancia para limpiar el plugin
  private pkInstance: any = null;

  ngOnInit(): void {
    this.initForm();
    this.resolverUserId();
    this.cargarDatosUsuario();
  }

  ngOnDestroy(): void {
    // Limpieza de la instancia al destruir el componente
    if (this.pkInstance && typeof this.pkInstance.destroy === 'function') {
      this.pkInstance.destroy();
    }
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

          // Un pequeño timeout para dar tiempo a que la directiva estructural (ej: *ngIf="isLoaded") dibuje el input en el DOM
          setTimeout(() => {
            this.initPlaceKit();
          }, 50);
        }
      },
      error: (err) => console.error('❌ Error al recuperar los datos del usuario:', err)
    });
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
          // 1. Extraemos de forma segura los metadatos desglosados de PlaceKit
          const calleYNumero = item.name || value; // Ej: "Calle Gema, 4"
          const codigoPostal = item.zipcode && item.zipcode.length > 0 ? item.zipcode[0] : ''; // Ej: "41015"
          const localidad = item.city || ''; // Ej: "Sevilla"
          const pais = item.country || 'España'; // Ej: "España"

          // 2. Construimos una cadena de texto postal perfecta e inequívoca
          let direccionCompleta = `${calleYNumero}`;
          if (codigoPostal || localidad) {
            direccionCompleta += `, ${codigoPostal} ${localidad}`.trim();
          }
          direccionCompleta += `, ${pais}`;

          // Limpiamos espacios extraños o comas repetidas si algún dato faltase
          direccionCompleta = direccionCompleta.replace(/,\s*,/g, ',').trim();

          // 3. Insertamos el valor formateado completo en el Formulario Reactivo
          this.editForm.patchValue({
            direccion: direccionCompleta
          });

          this.editForm.get('direccion')?.markAsDirty();
          this.editForm.get('direccion')?.markAsTouched();
        });
      });
    }
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