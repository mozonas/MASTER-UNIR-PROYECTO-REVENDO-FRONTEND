import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-aside',
  imports: [RouterLink, SidebarComponent],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
})
export class AsideComponent {
  private authService = inject(AuthService);

  role = signal(this.authService.getUserRole() ?? 'USUARIO');

  isStaff = computed(() => ['ADMIN'].includes(this.role()));

  actividadOpen = false;

  desplegarMenu():void {
  this.actividadOpen = !this.actividadOpen;
  }



}
