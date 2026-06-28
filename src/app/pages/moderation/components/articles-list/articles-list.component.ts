import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModerationService } from '../../../../services/moderation.service'; 
import { ArticleReport } from '../../../../interfaces/moderation.interface'; 
import { ArticlesHistoryTableComponent } from '../articles-history-table/articles-history-table.component'; 
import { ArticlesPendingTableComponent } from '../articles-pending-table/articles-pending-table.component'; 

@Component({
  selector: 'app-articles-list',
  standalone: true,
  imports: [CommonModule, ArticlesHistoryTableComponent, ArticlesPendingTableComponent],
  templateUrl: './articles-list.component.html',
  styleUrl: './articles-list.component.css'
})
export class ArticlesListComponent implements OnInit {
  private moderationService = inject(ModerationService);
  private router = inject(Router);

  pendingArticles = signal<ArticleReport[]>([]);
  articlesHistory = signal<ArticleReport[]>([]);

  ngOnInit(): void {
    this.loadArticlesData();
  }

  loadArticlesData(): void {
    this.moderationService.getPendingArticles().subscribe({
      next: (reports) => this.pendingArticles.set(reports),
      error: (err) => console.error('Error al cargar artículos pendientes:', err)
    });

    this.moderationService.getArticleHistory().subscribe({
      next: (history) => this.articlesHistory.set(history),
      error: (err) => console.error('Error al cargar historial de artículos:', err)
    });
  }

  goToDetail(reportId: number): void {
    const prefix = this.router.url.includes('admin') ? '/admin/moderacion' : '/moderation';
    this.router.navigate([`${prefix}/articulos/detalle`, reportId]);
  }

  volverAlPanel(): void {
    const prefix = this.router.url.includes('admin') ? '/admin/moderacion' : '/moderation';
    this.router.navigate([`${prefix}/panel`]);
  }
}

