import { Component, computed, inject, signal, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header-menu',
  imports: [RouterLink],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.css',
})
export class HeaderMenuComponent {
 
  private authService = inject (AuthService); 

  role = signal(this.authService.getUserRole() ?? 'USUARIO');
  username = signal(this.authService.getUserName() ?? '');

  isAdmin = computed(() =>
  this.role() === 'ADMIN' || this.role() === 'MODERADOR'
);

  
}

