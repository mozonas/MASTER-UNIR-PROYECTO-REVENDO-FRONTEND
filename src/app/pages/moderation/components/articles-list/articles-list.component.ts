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
  styleUrl: './articles-list.component.css',
})
export class ArticlesListComponent implements OnInit {
  private ModerationService = inject(ModerationService);
  private router = inject(Router);

  pendingArticles = signal<ArticleReport[]>([]);
  articlesHistory = signal<ArticleReport[]>([]);

  ngOnInit(): void {
    this.loadArticlesData();
  }

  loadArticlesData(): void {
    
    this.ModerationService.getPendingArticles().subscribe({
      next: (reports) => this.pendingArticles.set(reports),
      error: (err) => console.error(err)
    });

    this.ModerationService.getArticleHistory().subscribe({
      next: (history) => this.articlesHistory.set(history),
      error: (err) => console.error(err)
    });
  }

  goToDetail(reportId: number): void {
    this.router.navigate(['/moderation/articulos/detalle', reportId]);
  }
}
