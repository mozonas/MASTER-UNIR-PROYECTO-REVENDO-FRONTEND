import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModerationService } from '../../../../services/moderation.service';
import { ArticleReport } from '../../../../interfaces/moderation.interface';
import { ArticlesHistoryTableComponent } from '../articles-history-table/articles-history-table.component';
import { ArticlesPendingTableComponent } from '../articles-pending-table/articles-pending-table.component';
import { AuthService } from '../../../../services/auth.service';
// mog 280626 importamos authservice
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
  private auth = inject(AuthService);

  //mog 28/06/26 poder volver al menú de admin si eres admin
  private getBasePath(): string {
  return this.auth.getUserRole() === 'ADMIN'
    ? '/admin/moderacion'
    : '/moderation';
}



  ngOnInit(): void {
    console.log('ROL EN COMPONENTE:', this.auth.getUserRole());
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

/*   goToDetail(reportId: number): void {
    this.router.navigate(['/moderation/articulos/detalle', reportId]);
  } */
  
    // MOG 280626 comentamos para poder navegar como toca si eres admin
    // redefinimos el metodo getToDetail para que vaya en base a getBasePath

  goToDetail(reportId: number): void {
    const base = this.getBasePath();
    this.router.navigate([base + '/articulos/detalle', reportId]);
  }


/*   volverAlPanel(): void {
  this.router.navigate(['/moderation/panel']);
  } */
  // MOG 280626 comentamos para poder navegar como toca si eres admin
  // redefinimos el metodo volverAlPAnel para que vaya en base a getBasePath
  volverAlPanel(): void {
  const base = this.getBasePath();
  this.router.navigate([base + '/panel']);
}

}
