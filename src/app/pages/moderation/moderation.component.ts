import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModerationService } from '../../services/moderation.service';
import { BadgesResponse } from '../../interfaces/moderation.interface';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { SidebarOption } from '../../interfaces/sidebar.interface';


@Component({
  selector: 'app-moderation',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './moderation.component.html',
  styleUrls: ['./moderation.component.css']
})
export class ModerationComponent implements OnInit {
  // Control de la pestaña activa en la interfaz virtual
  currentTab: string = 'panel'; 

  // Inyección de servicios necesarios para la funcionalidad del componente
  private moderationService = inject(ModerationService);

  // Opciones de navegación del menú lateral
  menuOptions: SidebarOption[] = [
    { id: 'panel', name: 'Panel principal', icon: 'bi-speedometer2' },
    { id: 'chat', name: 'Gestión de chat', icon: 'bi-chat-left-text' },
    { id: 'articulos', name: 'Gestión de artículos', icon: 'bi-box-seam' }
  ];

  // Contadores para mostrar en los badges de las opciones del menú
  pendingArticlesCount = signal<number>(0);
  pendingChatsCount = signal<number>(0);

  // Carga inmediata de los datos al inicializar la pantalla
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

  // Manejador del enrutador virtual local
  changeTab(tabId: string): void {
    this.currentTab = tabId;
  }
}


