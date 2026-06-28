import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ModerationService } from '../../../../services/moderation.service';
import { ArticleInReview, ArticleReport } from '../../../../interfaces/moderation.interface';

@Component({
  selector: 'app-article-report-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-report-detail.component.html',
  styleUrl: './article-report-detail.component.css',
})
export class ArticleReportDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private moderationService = inject(ModerationService);

  reporteId = Number(this.route.snapshot.paramMap.get('id'));

  loading = signal<boolean>(true);
  resolving = signal<boolean>(false);
  notFound = signal<boolean>(false);
  articuloEnRevision = signal<ArticleInReview | null>(null);
  reporteHistorico = signal<ArticleReport | null>(null);

  ngOnInit(): void {
    this.cargarDetalle();
  }

  cargarDetalle(): void {
    this.loading.set(true);
    this.moderationService.getArticlesInReview().subscribe({
      next: (articulos) => {
        const encontrado = articulos.find(a => a.reporte_id === this.reporteId);
        if (encontrado) {
          this.articuloEnRevision.set(encontrado);
          this.loading.set(false);
          return;
        }
        this.buscarEnHistorial();
      },
      error: (err) => {
        console.error('Error al cargar el artículo en revisión:', err);
        this.buscarEnHistorial();
      }
    });
  }

  private buscarEnHistorial(): void {
    this.moderationService.getArticleHistory().subscribe({
      next: (historial) => {
        const encontrado = historial.find(r => r.id === this.reporteId);
        this.reporteHistorico.set(encontrado ?? null);
        this.notFound.set(!encontrado);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar el historial de reportes:', err);
        this.notFound.set(true);
        this.loading.set(false);
      }
    });
  }

  resolverReporte(accion: 'aprobar' | 'descartar'): void {
    this.resolving.set(true);
    this.moderationService.resolveReport(this.reporteId, accion).subscribe({
      next: () => this.volver(),
      error: (err) => {
        console.error('Error al resolver el reporte:', err);
        this.resolving.set(false);
      }
    });
  }

  volver(): void {
    const prefix = this.router.url.includes('admin') ? '/admin/moderacion' : '/moderation';
    this.router.navigate([`${prefix}/articulos`]);
  }
}
