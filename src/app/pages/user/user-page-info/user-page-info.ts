import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService, Usuario } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service'; // 1. Importa tu AuthService (ajusta la ruta si es necesario)

interface Stat {
  count: string;
  label: string;
}

@Component({
  selector: 'app-user-page-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-page-info.html',
  styleUrls: ['./user-page-info.css']
})
export class UserPageInfoComponent implements OnInit {
  private router = inject(Router);
  private userService = inject(UserService);
  private authService = inject(AuthService);   // 2. Inyecta el AuthService
  private cdr = inject(ChangeDetectorRef);

  isLoaded: boolean = false;

  currentUser: Usuario = {
    id: 0,
    nombre: '',
    apellidos: '',
    email: '',
    usuario: '',
    foto: null,
    perfil: 'USUARIO',
    fecha_nacimiento: null,
    created_at: '',
    direccion: '',
    descripcion: ''
  };

  personalDetails: { label: string; value: string; lowercase?: boolean }[] = [];

  stats: Stat[] = [
    { count: '500+', label: 'Clientes felices' },
    { count: '150', label: 'Proyectos completados' },
    { count: '850', label: 'Fotos capturadas' },
    { count: '190', label: 'Llamadas realizadas' },
  ];

  ngOnInit(): void {
    console.log('🔄 Iniciando carga del perfil del usuario...');

    // 3. Recuperamos el ID dinámicamente desde el Token a través del AuthService
    const userIdParaCargar = this.authService.getUserId();

    // 4. Validamos que el usuario realmente esté logueado y tenga un ID válido
    if (!userIdParaCargar) {
      console.warn('⚠️ No se encontró ID de usuario en el token. Redirigiendo al login...');
      this.router.navigate(['/login']); // O la ruta que manejes para el login
      return;
    }

    console.log(`🔍 Cargando datos para el usuario ID: ${userIdParaCargar}`);

    this.userService.getPerfilUsuario(userIdParaCargar).subscribe({
      next: (userData: any) => {
        console.log('✅ Datos recibidos tras recargar:', userData);

        // Si viene null o undefined, mostramos una alerta en consola para saberlo
        if (!userData) {
          console.warn('⚠️ El backend respondió con éxito pero el usuario no existe en la base de datos actual.');
          return;
        }

        // El modelo obligatorio devuelve rows[0] (un objeto directo), 
        // pero si por alguna razón viniera dentro de un array, lo extraemos con seguridad:
        const userObj = Array.isArray(userData) ? userData[0] : userData;

        if (userObj) {
          this.currentUser = userObj;
          this.generarDetallesPersonales();
          this.isLoaded = true;
          this.cdr.detectChanges(); // Forzamos el renderizado en la vista HTML
        }
      },
      error: (err) => {
        console.error('❌ Error en la petición HTTP al recargar:', err);
      }
    });
  }

  private generarDetallesPersonales(): void {
    if (!this.currentUser) return;

    this.personalDetails = [
      {
        label: 'Nombre',
        value: `${this.currentUser.nombre || ''} ${this.currentUser.apellidos || ''}`.trim() || 'No especificado'
      },
      {
        label: 'Usuario',
        value: this.currentUser.usuario ? `@${this.currentUser.usuario}` : 'No especificado'
      },
      {
        label: 'Email',
        value: this.currentUser.email || 'No especificado',
        lowercase: true
      },
      {
        label: 'Rol de Cuenta',
        value: this.currentUser.perfil || 'USUARIO'
      },
      {
        label: 'Cumpleaños',
        value: this.currentUser.fecha_nacimiento && this.currentUser.fecha_nacimiento !== ''
          ? new Date(this.currentUser.fecha_nacimiento).toLocaleDateString('es-ES')
          : 'No especificado'
      },
      {
        label: 'Miembro desde',
        value: this.currentUser.created_at && this.currentUser.created_at !== ''
          ? new Date(this.currentUser.created_at).toLocaleDateString('es-ES')
          : 'No especificado'
      }
    ];
  }

  irAEditar(): void {
    this.router.navigate(['/user-edit']);
  }
}