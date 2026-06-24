import { Component, Input, OnChanges, OnInit, SimpleChanges, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../../services/article.service';
import { AuthService } from '../../../services/auth.service';
import { iArticle } from '../../../interfaces/article.interface';
import { ArticleCardComponent } from '../../../shared/components/article-card/article-card.component';

@Component({
  selector: 'app-user-page-sell',
  imports: [CommonModule, ArticleCardComponent],
  templateUrl: './user-page-sell.html',
  styleUrls: ['./user-page-sell.css'],
})
export class UserPageSell implements OnInit, OnChanges {
  private articleService = inject(ArticleService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @Input() userId: number | null = null;

  articles = this.articleService.Articles;

  isAdminViewing: boolean = false;


  selectedFilter = signal<'all' | 'DISPONIBLE' | 'VENDIDO' | 'RESERVADO'>('all');
  currentPage = signal(1);
  pageSize = 6;

  filteredArticles = computed(() => {
    const filter = this.selectedFilter();
    const all = this.articles();
    if (filter === 'all') return all;
    return all.filter(a => a.estadoVenta === filter);
  });

  pageCount = computed(() => {
    return Math.max(1, Math.ceil(this.filteredArticles().length / this.pageSize));
  });

  pageNumbers = computed(() => {
    return Array.from({ length: this.pageCount() }, (_, index) => index + 1);
  });

  private currentPageRawArticles = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredArticles().slice(start, start + this.pageSize);
  });

  currentPageArticles = computed<iArticle[]>(() => this.currentPageRawArticles());

  ngOnChanges(changes: SimpleChanges): void {
    if ('userId' in changes) {
      const nextUserId = changes['userId'].currentValue as number | null;
      if (nextUserId && nextUserId > 0) {
        this.loadArticles();
      }
    }
  }

  ngOnInit(): void {
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    this.isAdminViewing = !!idFromRoute;

    if (!this.userId || this.userId <= 0) {
      this.loadArticles();
    }
  }

  private resolveUserId(): number | null {
    const inputUserId = this.userId && this.userId > 0 ? this.userId : null;
    const routeUserId = Number(this.route.snapshot.paramMap.get('id')) || null;

    return inputUserId ?? routeUserId ?? this.authService.getUserId();
  }

  private loadArticles(): void {
    const userId = this.resolveUserId();

    if (!userId) {
      console.error('No se pudo obtener el ID de usuario para cargar los artículos.');
      return;
    }

    this.articleService.getAllUserArticles(userId).subscribe({
      error: (error) => console.error('Error al cargar artículos:', error),
    });
  }

  setFilter(filter: 'all' | 'DISPONIBLE' | 'VENDIDO' | 'RESERVADO') {
    this.selectedFilter.set(filter);
    this.currentPage.set(1);
  }

  setPage(page: number) {
    if (page < 1 || page > this.pageCount()) return;
    this.currentPage.set(page);
  }

  onEdit(article: iArticle): void {
    if (!this.canManageArticle(article)) {
      return;
    }

    void this.router.navigate(['/article-form', article.id]);
  }

  onDelete(article: iArticle): void {
    if (!this.canManageArticle(article)) {
      return;
    }

    const confirmed = confirm(`¿Está seguro de que desea eliminar "${article.titulo}"? Esta acción no se puede deshacer.`);
    if (confirmed) {
      this.articleService.deleteArticle(article.id).subscribe({
        next: () => this.currentPage.set(Math.min(this.currentPage(), this.pageCount())),
        error: (error) => console.error('Error al eliminar artículo:', error),
      });
    }
  }

  addNewArticle() {
    void this.router.navigate(['/article-form']);
  }

  canManageArticle(article: iArticle): boolean {
    if (this.authService.getUserRole() === 'MODERADOR') {
      return true;
    }

    return this.authService.getUserId() === article.usuarios_id;
  }

  getFilterCount(filter: 'all' | 'DISPONIBLE' | 'VENDIDO' | 'RESERVADO'): number {
    const all = this.articles();
    if (filter === 'all') return all.length;
    return all.filter(a => a.estadoVenta === filter).length;
  }
}
