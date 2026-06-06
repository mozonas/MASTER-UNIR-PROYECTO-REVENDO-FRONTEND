import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModerationService } from '../../../services/moderation.service';

@Component({
  selector: 'app-moderation-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './moderation-dashboard.html',
  styleUrls: ['./moderation-dashboard.css']
})
export class ModerationDashboardComponent implements OnInit {
  // Control de la pestaña activa en la interfaz virtual
  currentTab: string = 'panel'; 

  // Inyección de servicios necesarios para la funcionalidad del componente
  private moderationService = inject(ModerationService);
  private cdr = inject(ChangeDetectorRef);

  // Opciones de navegación del menú lateral
  menuOptions = [
    { id: 'panel', name: 'Panel principal', icon: 'bi-speedometer2' },
    { id: 'chat', name: 'Gestión de chat', icon: 'bi-chat-left-text' },
    { id: 'articulos', name: 'Gestión de artículos', icon: 'bi-box-seam' }
  ];

  // Contadores para mostrar en los badges de las opciones del menú
  pendingArticlesCount: number = 0;
  pendingChatsCount: number = 0;

  // Carga inmediata de los datos al inicializar la pantalla
  ngOnInit(): void {
    this.moderationService.getBadgesCounters().subscribe({
      next: (data: { pendingArticlesCount: number; pendingChatsCount: number }) => {
        this.pendingArticlesCount = data.pendingArticlesCount;
        this.pendingChatsCount = data.pendingChatsCount;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al recuperar contadores desde Angular:', err);
        this.pendingArticlesCount = 0;
        this.pendingChatsCount = 0;
      }
    });
  }

  // Manejador del enrutador virtual local
  changeTab(tabId: string): void {
    this.currentTab = tabId;
  }
}


