import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AsideComponent } from '../../../shared/aside/aside.component'; 
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component'; 
import { SidebarOption } from '../../../interfaces/sidebar.interface'; 
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    AsideComponent,
    SidebarComponent
  ],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})

export class AdminLayoutComponent {

  private router = inject(Router);

  // Opciones del menú del moderador
  moderatorOptions: SidebarOption[] = [
    { id: 'panel', name: 'Panel principal', icon: 'bi-speedometer2' },
    { id: 'articulos', name: 'Gestión de artículos', icon: 'bi-box-seam' },
    { id: 'chat', name: 'Gestión de mensajería', icon: 'bi-chat-left-text' }
  ];

  handleModeratorNav(tabId: string) {
    this.router.navigate(['/admin/moderacion/' + tabId]);
  }
}
  
