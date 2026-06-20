import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Article } from '../../models/article.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input({ required: true }) article!: Article;
  @Input() showActions = false;
  @Output() editClicked = new EventEmitter<Article>();
  @Output() deleteClicked = new EventEmitter<Article>();
  private router = inject(Router);


  get estaReportado(): boolean {
    return !!this.article.estado_reporte;
  }

  get estaVendido(): boolean {
    return this.article.estadoVenta === 'VENDIDO';
  }

  get imageSrc(): string {
    const imagen = this.article.imagen?.trim();
    if (!imagen || imagen === 'undefined' || imagen === 'null') {
      return '/images/404.png';
    }

    return `http://localhost:3000/${imagen}`;
  }

  viewArticle(article: Article) {
    console.log('Ver artículo:', this.article.id);
    this.router.navigate(['/article-detail', this.article.id]);
  }
}
