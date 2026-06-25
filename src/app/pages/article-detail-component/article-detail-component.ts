import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { ModerationService } from '../../services/moderation.service';
import { AuthService } from '../../services/auth.service';
import { DetailSeller } from "../../shared/detail-seller/detail-seller";
import { iArticle } from '../../interfaces/article.interface';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ReportType } from '../../interfaces//report-type.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-article-detail-component',
  standalone: true,
  imports: [CommonModule, DetailSeller, FormsModule],
  templateUrl: './article-detail-component.html',
  styleUrl: './article-detail-component.css',
})
export class ArticleDetailComponent {
  modalOpen = false;
  selectedImage: string | null = null;
  article = signal<iArticle | null>(null);

  // Variable para controlar de forma manual la foto activa en el carrusel
  subindiceActivo = 0;

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
  listReportTypes: ReportType[] = [];
  selectedTypeReport: number = 0;

  galleryImages = computed(() => {
    const currentArticle = this.article();
    return currentArticle ? this.articlesService.getArticleImageUrls(currentArticle) : [];
  });

  constructor() {
    // Reseteamos el índice a 0 cada vez que el artículo cambie (por si navegas entre artículos)
    effect(() => {
      if (this.article()) {
        this.subindiceActivo = 0;
      }
    });
  }

  // Métodos manuales para el carrusel sin depender del JS de Bootstrap
  anteriorFoto(): void {
    const total = this.galleryImages().length;
    if (total <= 1) return;
    this.subindiceActivo = (this.subindiceActivo === 0) ? total - 1 : this.subindiceActivo - 1;
  }

  siguienteFoto(): void {
    const total = this.galleryImages().length;
    if (total <= 1) return;
    this.subindiceActivo = (this.subindiceActivo === total - 1) ? 0 : this.subindiceActivo + 1;
  }

  get estaReportado(): boolean {
    return this.reportado() || !!this.article()?.estado_reporte;
  }

  get estaVendido(): boolean {
    return this.article()?.estadoVenta === 'VENDIDO';
  }

  onReportar(): void {
    this.moderationService.getReportTypes().subscribe({
      next: (data: any) => {
        this.listReportTypes = data;
      },
      error: () => {

      }
    });
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
    this.moderationService.reportArticle(Number(articulo.id), this.motivoReporte().trim(), this.selectedTypeReport, usuarioId).subscribe({
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

  openImageModal(img: string) {
    this.selectedImage = img;
    this.modalOpen = true;
  }

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
  
  contactarVendedor() {
    const articulo = this.article();
    if (!articulo) return;
    this.router.navigate(['/chat'], { queryParams: { articuloId: articulo.id } });
  }

  /**
   * Función que captura el evento del selector de tipo de reporte
   * @param event 
   */
  onSelect(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  console.log('Seleccionado:', value);
}
}