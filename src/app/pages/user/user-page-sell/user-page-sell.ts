import { Component, OnInit, inject, signal, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../../services/article.service';
import { AuthService } from '../../../services/auth.service';
import { iArticle } from '../../../interfaces/article.interface';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-user-page-sell',
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './user-page-sell.html',
  styleUrls: ['./user-page-sell.css'],
})
export class UserPageSell implements OnInit {
  private articleService = inject(ArticleService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  sellerId = input<number | null>(null);
  adminView = input<boolean>(false);

  articles = this.articleService.Articles;

  loggedUserId: number | null = null;
  resolvedUserId: number | null = null;
  isAdminViewing: boolean = false;
  canManageArticles: boolean = false;


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

  ngOnInit(): void {
    this.loggedUserId = this.authService.getUserId();

    const routeUserId = Number(this.route.snapshot.paramMap.get('id')) || null;
    this.resolvedUserId = this.sellerId() ?? routeUserId ?? this.loggedUserId;

    this.isAdminViewing =
      this.adminView() ||
      (!!this.resolvedUserId && !!this.loggedUserId && this.resolvedUserId !== this.loggedUserId);
    this.canManageArticles =
      !!this.loggedUserId && !!this.resolvedUserId && this.loggedUserId === this.resolvedUserId;

    if (!this.resolvedUserId) {
      console.error('No se pudo obtener el ID de usuario para cargar los artículos.');
      return;
    }

    this.loadArticles(this.resolvedUserId);
  }

  private loadArticles(userId: number): void {
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
    if (!this.canManageArticles || !this.loggedUserId) {
      alert('Solo puedes editar tus propios artículos.');
      return;
    }

    void this.router.navigate(['/article-form', article.id]);
  }

  onDelete(article: iArticle): void {
    if (!this.canManageArticles || !this.loggedUserId) {
      alert('Solo puedes eliminar tus propios artículos.');
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
    if (!this.canManageArticles || !this.loggedUserId) {
      alert('Solo puedes crear artículos en tu propio perfil.');
      return;
    }

    void this.router.navigate(['/article-form']);
  }

  getFilterCount(filter: 'all' | 'DISPONIBLE' | 'VENDIDO' | 'RESERVADO'): number {
    const all = this.articles();
    if (filter === 'all') return all.length;
    return all.filter(a => a.estadoVenta === filter).length;
  }
}
