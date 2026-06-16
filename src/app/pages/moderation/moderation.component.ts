import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { ModerationService } from '../../services/moderation.service';
import { BadgesResponse } from '../../interfaces/moderation.interface';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { SidebarOption } from '../../interfaces/sidebar.interface';

@Component({
  selector: 'app-moderation',
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterOutlet], 
  templateUrl: './moderation.component.html',
  styleUrls: ['./moderation.component.css']
})
export class ModerationComponent implements OnInit {
  private moderationService = inject(ModerationService);
  private router = inject(Router); // 👈 Inyección del enrutador de Angular

  // Opciones de navegación del menú lateral
  menuOptions: SidebarOption[] = [
    { id: 'panel', name: 'Panel principal', icon: 'bi-speedometer2' },
    { id: 'articulos', name: 'Gestión de artículos', icon: 'bi-box-seam' },
    { id: 'chat', name: 'Gestión de mensajería', icon: 'bi-chat-left-text' }
  ];

  // Contadores para mostrar en los badges de las opciones del menú lateral
  pendingArticlesCount = signal<number>(0);
  pendingChatsCount = signal<number>(0);

  ngOnInit(): void {
    this.moderationService.getBadgesCounters().subscribe({
      next: (data: BadgesResponse) => {
        this.pendingArticlesCount.set(data.pendingArticlesCount);
        this.pendingChatsCount.set(data.pendingChatsCount);
      },
      error: (err) => {
        console.error('Error al recuperar contadores desde Angular:', err);
        this.pendingArticlesCount.set(0);
        this.pendingChatsCount.set(0);
      }
    });
  }
// Redireccionamiento del menu lateral
  handleNavigation(tabId: string): void {
    if (tabId === 'panel') {
      this.router.navigate(['/moderation/panel']);
    } else if (tabId === 'articulos') {
      this.router.navigate(['/moderation/articulos']);
    } else if (tabId === 'chat') {
      this.router.navigate(['/moderation/chat']);
    }
  }
}


