import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { iArticle } from '../../../interfaces/article.interface';
import { ArticleService } from '../../../services/article.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  private _article!: iArticle;

  @Input({ required: true })
  set article(value: iArticle) {
    this._article = value;
    this.imageCandidates = this.articleService.getArticleImageUrls(value);
    this.currentImageIndex = 0;
  }

  get article(): iArticle {
    return this._article;
  }

  @Input() showActions = false;
  @Output() editClicked = new EventEmitter<iArticle>();
  @Output() deleteClicked = new EventEmitter<iArticle>();
  private router = inject(Router);
  private articleService = inject(ArticleService);
  private sanitizer = inject(DomSanitizer);
  imageCandidates: string[] = [];
  currentImageIndex = 0;

  ngOnInit() {
    let userIdParaCargar: number | null = null;

    // 1. Intentamos obtener el ID desde los parámetros de la URL (ruta de Admin)
    const idFromRoute = this.route.snapshot.paramMap.get('id');

    if (idFromRoute) {
      userIdParaCargar = Number(idFromRoute);
      this.isAdminViewing = true; // El admin está auditando un perfil ajeno
      console.log(`📋 Modo Admin: Visualizando usuario desde URL con ID: ${userIdParaCargar}`);
    } else {
      // 2. Si no hay ID en la URL, mantenemos tu comportamiento original (Perfil propio del usuario logueado)
      userIdParaCargar = this.authService.getUserId();
      console.log(`👤 Modo Usuario: Visualizando perfil propio con ID: ${userIdParaCargar}`);
    }
  }

  get estaReportado(): boolean {
    return !!this.article.estado_reporte;
  }

  get estaVendido(): boolean {
    return this.article.estadoVenta === 'VENDIDO';
  }

  get imageSrc(): string | SafeUrl {
    const image = this.imageCandidates[this.currentImageIndex];
    const src = image ?? '/images/placeholder_articulo.png';
    return src.startsWith('data:image/')
      ? this.sanitizer.bypassSecurityTrustUrl(src)
      : src;
  }

  onImageError(): void {
    if (this.currentImageIndex < this.imageCandidates.length - 1) {
      this.currentImageIndex += 1;
      return;
    }

    this.currentImageIndex = this.imageCandidates.length;
  }

  viewArticle(article: iArticle) {
    console.log('Ver artículo:', this.article.id);
    this.router.navigate(['/article-detail', this.article.id]);
  }
}
