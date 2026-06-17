import { Component, computed, effect, inject, Input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header-menu',
  imports: [RouterLink],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.css',
})
export class HeaderMenuComponent {
  
  @Input() mostrarMenu: boolean = true;

  //inyección servicio para seleccionar role
  private authService = inject(AuthService);

  // Inyectamos el Router para la redirección post-logout
  private router = inject(Router);

  isLogged = this.authService.isLogged;


   constructor() {
    effect(() => {
      
    });
  }

  logout(): void {
    // Borra el token del sessionStorage (ajusta 'token' al nombre exacto que uses)
    sessionStorage.removeItem('token');

    // Opcional, si quieremos limpiar TODA la sesión:
    // sessionStorage.clear();

    // Redirige al usuario a la página principal o al login
    this.router.navigate(['/']);
  }

  role = signal(this.authService.getUserRole() ?? 'USUARIO');
  username = signal(this.authService.getUserName() ?? '');

  isStaff = computed(() => ['ADMIN', 'MODERADOR'].includes(this.role()));



}