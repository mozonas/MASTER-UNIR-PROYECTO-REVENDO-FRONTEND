import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  imports: [],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css',
})
export class AdminHeaderComponent {
  // Inyectamos el Router para la redirección post-logout
  private router = inject(Router);

  logout(): void {
    // Borra el token del sessionStorage (ajusta 'token' al nombre exacto que uses)
    sessionStorage.removeItem('token');

    // Opcional, si quieremos limpiar TODA la sesión:
    // sessionStorage.clear();

    // Redirige al usuario a la página principal o al login
    this.router.navigate(['/']);
  }
}
