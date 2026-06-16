import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModerationService } from '../../services/moderation.service';
import { BadgesResponse, ArticleInReview } from '../../interfaces/moderation.interface';
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
  currentTab: string = 'panel';

  private moderationService = inject(ModerationService);

  menuOptions: SidebarOption[] = [
    { id: 'panel', name: 'Panel principal', icon: 'bi-speedometer2' },
    { id: 'chat', name: 'Gestión de chat', icon: 'bi-chat-left-text' },
    { id: 'articulos', name: 'Gestión de artículos', icon: 'bi-box-seam' }
  ];

  pendingArticlesCount = signal<number>(0);
  pendingChatsCount = signal<number>(0);
  articulosEnRevision = signal<ArticleInReview[]>([]);
  cargandoArticulos = signal<boolean>(false);

  ngOnInit(): void {
    this.cargarContadores();
  }

  cargarContadores(): void {
    this.moderationService.getBadgesCounters().subscribe({
      next: (data: BadgesResponse) => {
        this.pendingArticlesCount.set(data.pendingArticlesCount);
        this.pendingChatsCount.set(data.pendingChatsCount);
      },
      error: (err) => {
        console.error('Error al recuperar contadores:', err);
        this.pendingArticlesCount.set(0);
        this.pendingChatsCount.set(0);
      }
    });
  }

  changeTab(tabId: string): void {
    this.currentTab = tabId;
    if (tabId === 'articulos') {
      this.cargarArticulosEnRevision();
    }
  }

  cargarArticulosEnRevision(): void {
    this.cargandoArticulos.set(true);
    this.moderationService.getArticlesInReview().subscribe({
      next: (data) => {
        this.articulosEnRevision.set(data);
        this.cargandoArticulos.set(false);
      },
      error: (err) => {
        console.error('Error al cargar artículos en revisión:', err);
        this.cargandoArticulos.set(false);
      }
    });
  }

  resolverReporte(reporteId: number, accion: 'aprobar' | 'descartar'): void {
    this.moderationService.resolveReport(reporteId, accion).subscribe({
      next: () => {
        this.articulosEnRevision.update(lista => lista.filter(a => a.reporte_id !== reporteId));
        this.pendingArticlesCount.update(n => Math.max(0, n - 1));
      },
      error: (err) => console.error('Error al resolver reporte:', err)
    });
  }
}
