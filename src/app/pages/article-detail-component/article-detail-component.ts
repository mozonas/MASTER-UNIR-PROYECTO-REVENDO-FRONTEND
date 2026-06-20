import { ChangeDetectorRef, Component, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { ModerationService } from '../../services/moderation.service';
import { AuthService } from '../../services/auth.service';
import { DetailSeller } from "../../shared/detail-seller/detail-seller";

@Component({
  selector: 'app-article-detail-component',
  imports: [CommonModule, DetailSeller],
  templateUrl: './article-detail-component.html',
  styleUrl: './article-detail-component.css',
})
export class ArticleDetailComponent {
  modalOpen = false;
  selectedImage: string | null = null;
  article = signal<any | null>(null);

  private route = inject(ActivatedRoute);
  private articlesService = inject(ArticleService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private moderationService = inject(ModerationService);

  mostrarModalReporte = signal(false);
  motivoReporte = signal('');
  enviandoReporte = signal(false);
  mensajeReporte = signal('');
  reportado = signal(false);

  constructor() {
    effect(() => {
      console.log('Artículo actualizado:', this.article());
    });
  }

  get estaReportado(): boolean {
    return this.reportado() || !!this.article()?.estado_reporte;
  }

  get estaVendido(): boolean {
    return this.article()?.estadoVenta === 'VENDIDO';
  }

  onReportar(): void {
    this.mostrarModalReporte.set(true);
    this.motivoReporte.set('');
    this.mensajeReporte.set('');
  }

  cerrarModalReporte(): void {
    this.mostrarModalReporte.set(false);
  }

  enviarReporte(): void {
    const usuarioId = this.authService.getUserId();
    const articulo = this.article();

    if (!usuarioId) {
      this.mensajeReporte.set('Error: debes iniciar sesión para reportar.');
      return;
    }
    if (!articulo) return;

    this.enviandoReporte.set(true);

    this.moderationService
      .reportArticle(articulo.id, this.motivoReporte().trim(), usuarioId)
      .subscribe({
        next: () => {
          this.reportado.set(true);
          this.mensajeReporte.set('Artículo reportado. Quedará en revisión por un moderador.');
          this.enviandoReporte.set(false);
          setTimeout(() => this.cerrarModalReporte(), 2000);
        },
        error: () => {
          this.mensajeReporte.set('Error al enviar el reporte. Inténtalo de nuevo.');
          this.enviandoReporte.set(false);
        }
      });
  }

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;

    const id = Number(idParam);   // ← CONVERSIÓN CORRECTA
    this.getArticleData(id);
  }

  /**
   * Función que solicita los datos de un artículo al Backend
   */
  async getArticleData(id: number) {   // ← AHORA NUMBER
    this.articlesService.getArticleById(id).subscribe({
      next: (data) => {
        this.article.set(data);
      },
      error: (err) => {
        console.error('Error cargando producto:', err);
        if (err.status === 404) {
          this.router.navigate(['/404']);
        }
      }
    });
  }

  openImageModal(img: string) {
    this.selectedImage = img;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedImage = null;
  }
}
