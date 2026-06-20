import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { iArticle } from '../../../interfaces/article.interface';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {

  @Input({ required: true }) article!: iArticle;
  @Input() showActions = false;

  @Output() editClicked = new EventEmitter<iArticle>();
  @Output() deleteClicked = new EventEmitter<iArticle>();

  private router = inject(Router);

  // ============================
  // NORMALIZADORES
  // ============================

  get imageUrl(): string {
    return this.article.image
        || this.article.imagen
        || 'images/placeholder-product.png';
  }

  get location(): string {
    return this.article.ubicacion
        || this.article.localizacion
        || 'Sin ubicación';
  }

  get categoryName(): string {
    return this.article.categoria_nombre || 'Sin categoría';
  }

  get estaReportado(): boolean {
    return !!this.article.estado_reporte;
  }

  get estaVendido(): boolean {
    return this.article.estadoVenta === 'VENDIDO';
  }

  viewArticle(article: iArticle) {
    this.router.navigate(['/article-detail', this.article.id]);
  }
}
