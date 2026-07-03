import { Component, computed, effect, inject, signal, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { ModerationService } from '../../services/moderation.service';
import { AuthService } from '../../services/auth.service';
import { TransactionsServices } from '../../services/transactions.service';
import { DetailSeller } from "../../shared/detail-seller/detail-seller";
import { Article } from '../../interfaces/article.interface';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ReportType } from '../../interfaces/report-type.interface';
import { FormsModule } from '@angular/forms';
import { ReportTypeComponent } from '../../shared/report-type/report-type.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-article-detail-component',
  standalone: true,
  imports: [CommonModule, DetailSeller, FormsModule, ReportTypeComponent],
  templateUrl: './article-detail-component.html',
  styleUrl: './article-detail-component.css',
})
export class ArticleDetailComponent implements OnInit {
  modalOpen = false;
  selectedImage: string | null = null;
  article = signal<Article | null>(null);
  subindiceActivo = 0;

  private route = inject(ActivatedRoute);
  private articlesService = inject(ArticleService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private moderationService = inject(ModerationService);
  private transactionsService = inject(TransactionsServices);
  private sanitizer = inject(DomSanitizer);
  private location = inject(Location);

  mapUrl: SafeResourceUrl | null = null;

  mostrarModalReporte = signal(false);
  motivoReporte = signal('');
  enviandoReporte = signal(false);
  mensajeReporte = signal('');
  reportado = signal(false);
  listReportTypes: ReportType[] = [];
  selectedTypeReport: number = 0;

  comprando = signal(false);
  mensajeCompra = signal('');

  galleryImages = computed(() => {
    const currentArticle = this.article();
    return currentArticle ? this.articlesService.getArticleImageUrls(currentArticle) : [];
  });

  constructor() {
    effect(() => {
      if (this.article()) {
        this.subindiceActivo = 0;
      }
    });
  }

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

  get estaEnRevision(): boolean {
    return this.article()?.estadoVenta === 'EN_REVISION';
  }

  get esPropietario(): boolean {
    const usuarioId = this.authService.getUserId();
    return !!usuarioId && usuarioId === this.article()?.usuarios_id;
  }

  get puedeComprar(): boolean {
    return this.authService.isLogged() && !this.esPropietario;
  }

  get compraDeshabilitada(): boolean {
    return this.comprando() || this.article()?.estadoVenta !== 'DISPONIBLE';
  }

  get estadoLabel(): string {
    const estado = this.article()?.estadoVenta;
    const etiquetas: Record<string, string> = {
      DISPONIBLE: 'Disponible',
      EN_REVISION: 'En revisión',
      RETIRADO: 'Retirado',
      VENDIDO: 'Vendido',
    };
    return estado ? (etiquetas[estado] ?? estado) : '';
  }

  onReportar(): void {
    this.moderationService.getReportTypes('ARTICULO').subscribe({
      next: (data: any) => {
        this.listReportTypes = data;
      },
      error: () => { }
    });
    this.mostrarModalReporte.set(true);
    this.motivoReporte.set('');
    this.mensajeReporte.set('');
  }

  cerrarModalReporte(): void {
    this.mostrarModalReporte.set(false);
  }

  //CGM 01/07/26 --> redirección home
  redireccion(): void {
  this.reportado.set(true);
  setTimeout(() => {
    this.router.navigate(['/home']); 
  }, 1200);
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
    this.router.navigate(['/home']);
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.getArticleData(id);
  }

  async getArticleData(id: string) {
    this.articlesService.getArticleById(id).subscribe({
      next: (res: any) => {
        const articuloLimpio = res?.data ? res.data : res;

        if (!articuloLimpio) {
          this.router.navigate(['/404']);
          return;
        }

        this.article.set(articuloLimpio);

        // Pasamos el objeto directamente para el renderizado del mapa
        this.generarUrlMapa(articuloLimpio);
      },
      error: (err) => {
        console.error('Error cargando producto:', err);
        if (err.status === 404) {
          this.router.navigate(['/404']);
        }
      }
    });
  }

  private generarUrlMapa(articulo: any): void {
    const direccionRaw = articulo?.seller?.direccion || articulo?.direccion || '';
    const direccionCompleta = direccionRaw.trim();

    if (direccionCompleta) {
      let urlBase = '';
      if (direccionCompleta.includes('[COORD:')) {
        try {
          const coordSection = direccionCompleta.split('[COORD:')[1].replace(']', '').trim();
          const [lat, lng] = coordSection.split(',');
          urlBase = `https://maps.google.com/maps?q=${lat.trim()},${lng.trim()}&ll=${lat.trim()},${lng.trim()}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
        } catch (e) {
          urlBase = `https://maps.google.com/maps?q=${encodeURIComponent(direccionCompleta)}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
        }
      } else {
        urlBase = `https://maps.google.com/maps?q=${encodeURIComponent(direccionCompleta)}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
      }
      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(urlBase);
    } else {
      this.mapUrl = null;
    }
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
    return value.startsWith('data:image/') ? this.sanitizer.bypassSecurityTrustUrl(value) : value;
  }

  async abrirConfirmacionCompra(): Promise<void> {
    const articulo = this.article();
    if (!articulo) return;

    this.mensajeCompra.set('');

    const result = await Swal.fire({
      title: 'Confirmar compra',
      text: `Vas a proceder a la compra de ${articulo.titulo} por ${articulo.precio} €.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#8cd86a',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      this.comprarArticulo();
    }
  }

  private comprarArticulo(): void {
    const articulo = this.article();
    const usuarioId = this.authService.getUserId();

    if (!articulo || !usuarioId) {
      this.mensajeCompra.set('Error: debes iniciar sesión para comprar.');
      return;
    }

    this.comprando.set(true);
    this.mensajeCompra.set('');

    this.transactionsService.comprar(articulo.id, usuarioId).subscribe({
      next: (res: any) => {
        this.article.update(a => a ? { ...a, estadoVenta: 'VENDIDO' } : a);
        this.comprando.set(false);

        // 🌟 Recuperamos el ID de la transacción devuelta por el servidor
        const transaccionId = res?.transaccionId || res?.id || 1;

        // 🌟 Redirección inmediata cambiando de componente en la misma pestaña
        this.router.navigate(['/evaluar'], {
          queryParams: {
            vendedorId: articulo.usuarios_id,
            transaccionId: transaccionId,
            titulo: articulo.titulo
          }
        });
      },
      error: (err) => {
        if (err.status === 409) {
          this.mensajeCompra.set('Este artículo ya no está disponible.');
          this.getArticleData(String(articulo.id));
        } else if (err.status === 400) {
          this.mensajeCompra.set('No puedes comprar tu propio artículo.');
        } else {
          this.mensajeCompra.set('Error al procesar la compra. Inténtalo de nuevo.');
        }
        this.comprando.set(false);
      }
    });
  }

  contactarVendedor() {
    const articulo = this.article();
    if (!articulo) return;
    this.router.navigate(['/chat'], { queryParams: { articuloId: articulo.id } });
  }

  onBack(): void {
    this.location.back();
  }

  verPerfilVendedor(): void {
    const sellerId = this.article()?.usuarios_id;
    if (sellerId && sellerId > 0) {
      this.router.navigate(['/user-info', sellerId]);
    }
  }

  onSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    console.log('Seleccionado:', value);
  }
}