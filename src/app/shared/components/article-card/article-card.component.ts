import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { iArticle } from '../../../interfaces/article.interface';

@Component({
  selector: 'app-article-card',
  imports: [CurrencyPipe],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.css',
})
export class ArticleCardComponent {
  private authService = inject(AuthService);

  @Input({ required: true }) article!: iArticle;
  @Input() showActions = false;
  @Output() editClicked = new EventEmitter<void>();
  @Output() deleteClicked = new EventEmitter<void>();
  private router = inject(Router);

  get estaReportado(): boolean {
    return !!this.article.estado_reporte;
  }

  get estaVendido(): boolean {
    return this.article.estadoVenta === 'VENDIDO';
  }

  get canManageArticle(): boolean {
    if (this.authService.getUserRole() === 'MODERADOR') {
      return true;
    }

    return this.authService.getUserId() === this.article.usuarios_id;
  }

  viewArticle(article: iArticle) {
    console.log('Ver artículo:', this.article.id);
    this.router.navigate(['/article-detail', this.article.id]);
  }
}

