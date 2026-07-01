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
  isExternalProfileViewing: boolean = false; // Usuario normal viendo perfil ajeno

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
  transaccionPendiente: any = null;
  puedeValorar: boolean = false;

  ngOnInit(): void {
    console.log('🔄 Iniciando carga del perfil del usuario...');

    let userIdParaCargar: number | null = null;

    // 1. Intentamos obtener el ID desde los parámetros de la URL (ruta de Admin)
    const idFromRoute = this.route.snapshot.paramMap.get('id');

    // Recuperamos el ID del usuario logueado actualmente y su rol
    const currentLoggedUserId = this.authService.getUserId();
    const isUserAdmin = this.authService.getUserRole() === 'ADMIN';

    if (idFromRoute) {
      userIdParaCargar = Number(idFromRoute);

      // Visualización de Admin si el que está logueado es verdaderamente un ADMIN
      if (isUserAdmin) {
        this.isAdminViewing = true;
        console.log(`📋 Modo Admin: Visualizando usuario desde URL con ID: ${userIdParaCargar}`);
      } else {
        this.isExternalProfileViewing = true;
        console.log(`👁️ Modo Común: Un usuario está viendo el perfil del vendedor ID: ${userIdParaCargar}`);
      }
    } else {
      // 2. Si no hay ID en la URL, mantenemos tu comportamiento original (Perfil propio del usuario logueado)
      userIdParaCargar = Number(currentLoggedUserId);
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

          // Traemos las estadísticas e integraciones reales
          this.cargarEstadisticasReales(userIdParaCargar!);

          const miUsuarioId = Number(this.authService.getUserId());
          if (this.isExternalProfileViewing && miUsuarioId) {
            this.userService.getTransaccionPendiente(this.idVendedor, miUsuarioId).subscribe({
              next: (data) => {
                if (data) {
                  this.transaccionPendiente = data;
                  this.puedeValorar = true;
                  this.cdr.detectChanges();
                }
              },
              error: (err) => console.error('❌ Error al comprobar transacciones pendientes:', err)
            });
          }
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

  irAValorar(): void {
    if (!this.transaccionPendiente) return;

    this.router.navigate(['/evaluar'], {
      queryParams: {
        vendedorId: this.idVendedor,
        transaccionId: this.transaccionPendiente.transaccion_id,
        titulo: this.transaccionPendiente.articulo_titulo
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
          urlBase = `https://maps.google.com/maps?q=${lat.trim()},${lng.trim()}&ll=${lat.trim()},${lng.trim()}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
        } catch (e) {
          console.error('Error al parsear las coordenadas de la dirección:', e);
          // Si falla el parseo por lo que sea, cae en el buscador clásico por texto
          urlBase = `https://maps.google.com/maps?q=${encodeURIComponent(direccionCompleta)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
        }
      } else {
        // Si es un usuario antiguo sin el tag de coordenadas, buscamos por texto plano
        urlBase = `https://maps.google.com/maps?q=${encodeURIComponent(direccionCompleta)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
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
    if (this.isAdminViewing) {
      // Si el admin está auditando, pasamos el ID del usuario en la ruta para mantener el modo admin
      this.router.navigate(['/admin/users/editar/', this.idVendedor]);
    } else {
      // Si es el usuario común en su propio perfil, va directo a la ruta limpia
      this.router.navigate(['/user-edit']);
    }
  }

  onBack(): void {
    if (this.isAdminViewing) {
      // 1. Si es el admin auditando, lo devuelve estrictamente a la lista de gestión de usuarios
      this.router.navigate(['/admin/users']);
    } else if (this.isExternalProfileViewing) {
      // 2. Si es un usuario normal que venía de ver un artículo, vuelve atrás en el historial (al detalle del artículo)
      this.location.back();
    } else {
      // 3. Si estaba revisando su propio perfil desde el menú de navegación habitual, va al Home
      this.router.navigate(['/home']);
    }
  }
}