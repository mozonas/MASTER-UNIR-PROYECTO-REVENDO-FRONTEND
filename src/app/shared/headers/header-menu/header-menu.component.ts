import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-menu',
  imports: [RouterLink],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.css',
})
export class HeaderMenuComponent {
 @Input() mostrarMenu: boolean = true;
  private authService = inject (AuthService); 

  // Inyectamos el Router para la redirección post-logout
  private router = inject(Router);

  logout(): void {
    sessionStorage.removeItem('token');
}