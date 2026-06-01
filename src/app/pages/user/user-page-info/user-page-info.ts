import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService, Usuario } from '../../../services/user.service'; // Asegura la ruta correcta

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
  private userService = inject(UserService); // Inyectamos el servicio HTTP
  private cdr = inject(ChangeDetectorRef);   // 🔥 Inyectamos el detector de cambios de Angular

  // Flag de control para el bloque condicional del HTML (@if)
  isLoaded: boolean = false;

  // Inicializamos el objeto con valores vacíos por defecto pero con la estructura correcta
  currentUser: Usuario = {
    id: 0,
    nombre: '',
    apellidos: '',
    email: '',
    usuario: '',
    foto: null,
    perfil: 'USUARIO',
    fecha_nacimiento: null,
    created_at: ''
  };

  personalDetails: { label: string; value: string; lowercase?: boolean }[] = [];

  stats: Stat[] = [
    { count: '500+', label: 'Clientes felices' },
    { count: '150', label: 'Proyectos completados' },
    { count: '850', label: 'Fotos capturadas' },
    { count: '190', label: 'Llamadas realizadas' },
  ];

  ngOnInit(): void {
    console.log('🔄 Iniciando carga del perfil del usuario 34...');
    const userIdParaCargar = 34;

    this.userService.getPerfilUsuario(userIdParaCargar).subscribe({
      next: (userData: any) => {
        console.log('✅ Datos recibidos tras recargar:', userData);

        // Si el backend te devuelve un array, extraemos el objeto
        const userObj = Array.isArray(userData) ? userData[0] : userData;

        if (userObj) {
          // Asignamos los datos reales sustituyendo los vacíos
          this.currentUser = userObj;
          
          // Generamos los textos planos del listado del perfil
          this.generarDetallesPersonales();

          // 🔥 Marcamos que ya está listo y forzamos el redibujado síncrono del HTML
          this.isLoaded = true;
          this.cdr.detectChanges();
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
        // Validamos de forma estricta que la fecha exista y no sea un string vacío antes de instanciar el objeto Date
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