import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Usuario } from '../../../interfaces/user.interface';
import { UserPageSell } from '../user-page-sell/user-page-sell';
import { DetailSeller } from "../../../shared/detail-seller/detail-seller";


@Component({
  selector: 'app-user-page-info',
  standalone: true,
  imports: [CommonModule, UserPageSell, DetailSeller],
  templateUrl: './user-page-info.html',
  styleUrls: ['./user-page-info.css']
})

export class UserPageInfoComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);

  private location = inject(Location);


  isLoaded: boolean = false;
  mapUrl: SafeResourceUrl | null = null;
  isAdminViewing: boolean = false;

  activeTab: 'productos' | 'valoraciones' = 'productos';

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
  listaValoraciones: any[] = [];
  idVendedor!: number;

  ngOnInit(): void {
    console.log('🔄 Iniciando carga del perfil del usuario...');

    let userIdParaCargar: number | null = null;

    // 1. Intentamos obtener el ID desde los parámetros de la URL (ruta de Admin)
    const idFromRoute = this.route.snapshot.paramMap.get('id');

    if (idFromRoute) {
      userIdParaCargar = Number(idFromRoute);
      this.isAdminViewing = true; // El admin está auditando un perfil ajeno
      console.log(`📋 Modo Admin: Visualizando usuario desde URL con ID: ${userIdParaCargar}`);
    } else {
      // 2. Si no hay ID en la URL, mantenemos tu comportamiento original (Perfil propio del usuario logueado)
      userIdParaCargar = this.authService.getUserId();
      console.log(`👤 Modo Usuario: Visualizando perfil propio con ID: ${userIdParaCargar}`);
    }

    // Validamos que hayamos obtenido un ID por cualquiera de las dos vías
    if (!userIdParaCargar) {
      console.warn('⚠️ No se pudo determinar el ID del usuario. Redirigiendo al login...');
      this.router.navigate(['/login']);
      return;
    }

    console.log(`🔍 Cargando datos para el usuario ID: ${userIdParaCargar}`);
    this.idVendedor = userIdParaCargar;
    // Recuperamos los datos del perfil del usuario
    this.userService.getPerfilUsuario(userIdParaCargar).subscribe({
      next: (userData: any) => {
        console.log('✅ Datos de usuario recibidos:', userData);

        if (!userData) {
          console.warn('⚠️ El backend respondió con éxito pero el usuario no existe.');
          return;
        }
        const userObj = Array.isArray(userData) ? userData[0] : userData;
        console.log("¡ATENCIÓN! Dirección real que devuelve la API:", userObj?.direccion);

        if (userObj) {
          this.currentUser = userObj;
          this.generarDetallesPersonales();
          this.generarUrlMapa();

          // Traemos las estadísticas del ID seleccionado
          this.cargarEstadisticasReales(userIdParaCargar!);
        }
      },
      error: (err) => {
        console.error('❌ Error en la petición HTTP al recargar:', err);
        this.isLoaded = true;
        this.cdr.detectChanges();
      }
    });
  }

  private cargarEstadisticasReales(userId: number): void {
    this.userService.getEstadisticasUsuario(userId).subscribe({
      next: (stats) => {
        console.log('✅ Estadísticas reales recibidas de la BD:', stats);
        if (stats) {
          this.totalVendidos = stats.total_vendidos;
          this.totalValoraciones = stats.total_valoraciones;
          this.ratingMedia = Number(stats.rating_media) || 0;
        }

        this.userService.getValoracionesUsuario(userId).subscribe({
          next: (reviews) => {
            this.listaValoraciones = reviews || [];
            this.isLoaded = true;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('❌ Error en la petición HTTP al recargar valoraciones:', err);
            this.isLoaded = true;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('❌ Error en la petición HTTP al recargar estadísticas:', err);
        this.isLoaded = true;
        this.cdr.detectChanges();
      }
    });
  }

  private generarUrlMapa(): void {
    const direccionCompleta = this.currentUser.direccion ? this.currentUser.direccion.trim() : '';

    if (direccionCompleta) {
      let urlBase = '';

      // Comprobamos si la dirección viene con el tag de coordenadas [COORD: lat,lng]
      if (direccionCompleta.includes('[COORD:')) {
        try {
          // Extraemos la parte de las coordenadas
          const coordSection = direccionCompleta.split('[COORD:')[1].replace(']', '').trim();
          const [lat, lng] = coordSection.split(',');

          // Url exacta para embeber coordenadas con una sola chincheta (q=) y centrado (ll=)
          urlBase = `https://maps.google.com/maps?q=${lat.trim()},${lng.trim()}&ll=${lat.trim()},${lng.trim()}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        } catch (e) {
          console.error('Error al parsear las coordenadas de la dirección:', e);
          // Si falla el parseo por lo que sea, cae en el buscador clásico por texto
          urlBase = `https://maps.google.com/maps?q=${encodeURIComponent(direccionCompleta)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        }
      } else {
        // Si es un usuario antiguo sin el tag de coordenadas, buscamos por texto plano
        urlBase = `https://maps.google.com/maps?q=${encodeURIComponent(direccionCompleta)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      }

      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(urlBase);
    } else {
      this.mapUrl = null;
    }
  }

  private generarDetallesPersonales(): void {
    if (!this.currentUser) return;

    this.personalDetails = [
      { label: 'Usuario', value: this.currentUser.usuario ? `@${this.currentUser.usuario}` : 'No especificado' },
      { label: 'Email', value: this.currentUser.email || 'No especificado', lowercase: true },
      { label: 'Cumpleaños', value: this.currentUser.fecha_nacimiento ? new Date(this.currentUser.fecha_nacimiento).toLocaleDateString('es-ES') : 'No especificado' },
      { label: 'Miembro desde', value: this.currentUser.created_at ? new Date(this.currentUser.created_at).toLocaleDateString('es-ES') : 'No especificado' }
    ];

    if (this.currentUser.perfil === 'MODERADOR' || this.currentUser.perfil === 'ADMIN') {
      this.personalDetails.push({
        label: 'Rol de Cuenta',
        value: this.currentUser.perfil
      });
    }
  }

  get estrellas() {
    const estrellasArray = [];
    for (let i = 1; i <= 5; i++) {
      // Calculamos la diferencia entre la nota media y la estrella actual
      const diferencia = this.ratingMedia - (i - 1);
      if (diferencia >= 0.75) estrellasArray.push('fa-star');
      else if (diferencia >= 0.25) estrellasArray.push('fa-star-half');
      else estrellasArray.push('fa-star-o');
    }
    return estrellasArray;
  }

  changeTab(tab: 'productos' | 'valoraciones'): void {
    this.activeTab = tab;
  }

  irAEditar(): void {
    this.router.navigate(['/user-edit']);
  }

  onBack(): void {
    // Si es el admin auditando, lo devolvemos a la lista de usuarios del panel de control
    if (this.isAdminViewing) {
      this.router.navigate(['/admin/users']);
    } else {
      // Si es un usuario normal, lo mandamos al Home o al Hub principal
      this.router.navigate(['/home']);
    }
  }
}