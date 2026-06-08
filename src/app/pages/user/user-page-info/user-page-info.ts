import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Usuario } from '../../../interfaces/user.interface';

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
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);

  isLoaded: boolean = false;
  mapUrl: SafeResourceUrl | null = null;

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

  totalValoraciones: number = 0;
  ratingMedia: number = 0;
  totalVendidos: number = 0;

  personalDetails: { label: string; value: string; lowercase?: boolean }[] = [];

  ngOnInit(): void {
    console.log('🔄 Iniciando carga del perfil del usuario...');

    // Recuperamos el ID dinámicamente desde el Token a través del AuthService
    const userIdParaCargar = this.authService.getUserId();

    // Validamos que el usuario realmente esté logueado y tenga un ID válido
    if (!userIdParaCargar) {
      console.warn('⚠️ No se encontró ID de usuario en el token. Redirigiendo al login...');
      this.router.navigate(['/login']);
      return;
    }

    console.log(`🔍 Cargando datos para el usuario ID: ${userIdParaCargar}`);

    // Recuperamos los datos del perfil del usuario
    this.userService.getPerfilUsuario(userIdParaCargar).subscribe({
      next: (userData: any) => {
        console.log('✅ Datos de usuario recibidos:', userData);

        if (!userData) {
          console.warn('⚠️ El backend respondió con éxito pero el usuario no existe.');
          return;
        }
        const userObj = Array.isArray(userData) ? userData[0] : userData;

        if (userObj) {
          this.currentUser = userObj;
          this.generarDetallesPersonales();
          this.generarUrlMapa();

          // Traemos de forma síncrona/paralela las estadísticas del backend
          this.cargarEstadisticasReales(userIdParaCargar);
        }
      },
      error: (err) => {
        console.error('❌ Error en la petición HTTP al recargar:', err);
        this.isLoaded = true; // Permitimos renderizar la página aunque falle la carga del perfil, para mostrar mensajes de error o estados vacíos
        this.cdr.detectChanges();
      }
    });
  }

  // Método encargado de mapear de forma segura el JSON devuelto por tu backend
  private cargarEstadisticasReales(userId: number): void {
    this.userService.getEstadisticasUsuario(userId).subscribe({
      next: (stats) => {
        console.log('✅ Estadísticas reales recibidas de la BD:', stats);
        if (stats) {
          this.totalVendidos = stats.total_vendidos;
          this.totalValoraciones = stats.total_valoraciones;
          this.ratingMedia = Number(stats.rating_media) || 0;
        }

        // Una vez tenemos perfil y estadísticas mapeadas, renderizamos la vista completa
        this.isLoaded = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error al obtener estadísticas agregadas:', err);
        // Permitimos renderizar la página igualmente si fallan solo los contadores
        this.isLoaded = true;
        this.cdr.detectChanges();
      }
    });
  }

  // Método para construir la URL segura usando la dirección de la BD
  private generarUrlMapa(): void {
    const direccion = this.currentUser.direccion ? this.currentUser.direccion.trim() : '';

    if (direccion) {
      // Usamos la API pública de Google Maps Embed metiendo la dirección codificada en el parámetro 'q'
      const urlBase = `https://maps.google.com/maps?q=${encodeURIComponent(direccion)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(urlBase);
    } else {
      this.mapUrl = null;
    }
  }

  private generarDetallesPersonales(): void {
    if (!this.currentUser) return;

    // 1. Inicializamos los datos comunes a TODOS los usuarios
    this.personalDetails = [
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

    // 2. Condicional: Solo si el rol es MODERADOR o ADMIN, añadimos el bloque del Rol
    if (this.currentUser.perfil === 'MODERADOR' || this.currentUser.perfil === 'ADMIN') {
      this.personalDetails.push({
        label: 'Rol de Cuenta',
        value: this.currentUser.perfil
      });
    }
  }

  // Helper rápido para generar el array de estrellas en el HTML
  get estrellas() {
    const estrellasArray = [];

    for (let i = 1; i <= 5; i++) {
      // Calculamos la diferencia entre la nota media y la estrella actual
      const diferencia = this.ratingMedia - (i - 1);

      if (diferencia >= 0.75) {
        estrellasArray.push('fa-star');        // Estrella completa
      } else if (diferencia >= 0.25) {
        estrellasArray.push('fa-star-half');   // Media estrella
      } else {
        estrellasArray.push('fa-star-o');      // Estrella vacía
      }
    }

    return estrellasArray;
  }

  irAEditar(): void {
    this.router.navigate(['/user-edit']);
  }
}