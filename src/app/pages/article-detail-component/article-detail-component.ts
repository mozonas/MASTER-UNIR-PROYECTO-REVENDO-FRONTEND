import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { ModerationService } from '../../services/moderation.service';
import { AuthService } from '../../services/auth.service';
import { DetailSeller } from "../../shared/detail-seller/detail-seller";
import { Article } from '../../interfaces/article.interface';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-article-detail-component',
  imports: [CommonModule, DetailSeller],
  templateUrl: './article-detail-component.html',
  styleUrl: './article-detail-component.css',
})
export class ArticleDetailComponent {
  modalOpen = false;
  selectedImage: string | null = null;
  article = signal<Article | null>(null);
  private route = inject(ActivatedRoute);
  private articlesService = inject(ArticleService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private moderationService = inject(ModerationService);
  private sanitizer = inject(DomSanitizer);

  mostrarModalReporte = signal(false);
  motivoReporte = signal('');
  enviandoReporte = signal(false);
  mensajeReporte = signal('');
  reportado = signal(false);
  galleryImages = computed(() => {
    const currentArticle = this.article();
    return currentArticle ? this.articlesService.getArticleImageUrls(currentArticle) : [];
  });

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
    this.moderationService.reportArticle(Number(articulo.id), this.motivoReporte().trim(), usuarioId).subscribe({
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
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.getArticleData(id);
  }

  /**
   * Función que solicita los datos de un artículo al Backend
   * @param id id del artículo del que solicitamos los datos
   */
  async getArticleData(id: string) {
    this.articlesService.getArticleById(id).subscribe({
      next: (data) => {
        this.article.set(data ?? null);

      },
      error: (err) => {
        console.error('Error cargando producto:', err);
        if (err.status === 404) {
          this.router.navigate(['/404']);
        }
      }
    });
  }

  /**
   * Función que abre el modal que muestra la imagen del carrusel
   * @param img 
   */
  openImageModal(img: string) {
    this.selectedImage = img;
    this.modalOpen = true;
  }

  /**
   * Función que cierra el modal de la imagen
   */
  closeModal() {
    this.modalOpen = false;
    this.selectedImage = null;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement | null;
    if (!target) return;

    if (!target.src.endsWith('/images/placeholder_articulo.png')) {
      target.src = '/images/placeholder_articulo.png';
    }
  }

  getSafeImageUrl(url: string | null | undefined): string | SafeUrl {
    const value = url ?? '/images/placeholder_articulo.png';
    return value.startsWith('data:image/')
      ? this.sanitizer.bypassSecurityTrustUrl(value)
      : value;
  }

}
