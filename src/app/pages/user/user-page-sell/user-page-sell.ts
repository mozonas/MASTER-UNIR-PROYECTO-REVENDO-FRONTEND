import { Component, OnInit, inject, signal, computed } from '@angular/core';
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
export class UserPageSell implements OnInit {
  private articleService = inject(ArticleService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  articles = this.articleService.Articles;

  isAdminViewing: boolean = false;


  selectedFilter = signal<'all' | 'DISPONIBLE' | 'VENDIDO'>('all');
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
    this.loadArticles();

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

  private loadArticles(): void {
    const routeUserId = Number(this.route.snapshot.paramMap.get('id')) || null;
    const userId = routeUserId ?? this.authService.getUserId();

    if (!userId) {
      console.error('No se pudo obtener el ID de usuario para cargar los artículos.');
      return;
    }

    this.articleService.getAllUserArticles(userId).subscribe({
      error: (error) => console.error('Error al cargar artículos:', error),
    });
  }

  setFilter(filter: 'all' | 'DISPONIBLE' | 'VENDIDO') {
    this.selectedFilter.set(filter);
    this.currentPage.set(1);
  }

  setPage(page: number) {
    if (page < 1 || page > this.pageCount()) return;
    this.currentPage.set(page);
  }

  onEdit(article: iArticle): void {
    const routeUserId = Number(this.route.snapshot.paramMap.get('id')) || null;
    const userId = routeUserId ?? this.authService.getUserId();
    void this.router.navigate(['/article-form', article.id], { queryParams: { userId } });
  }

  onDelete(article: iArticle): void {
    const confirmed = confirm(`¿Está seguro de que desea eliminar "${article.titulo}"? Esta acción no se puede deshacer.`);
    if (confirmed) {
      this.articleService.deleteArticle(article.id).subscribe({
        next: () => this.currentPage.set(Math.min(this.currentPage(), this.pageCount())),
        error: (error) => console.error('Error al eliminar artículo:', error),
      });
    }
  }

  addNewArticle() {
    const routeUserId = Number(this.route.snapshot.paramMap.get('id')) || null;
    const userId = routeUserId ?? this.authService.getUserId();
    void this.router.navigate(['/article-form'], { queryParams: { userId } });
  }

  getFilterCount(filter: 'all' | 'DISPONIBLE' | 'VENDIDO'): number {
    const all = this.articles();
    if (filter === 'all') return all.length;
    return all.filter(a => a.estadoVenta === filter).length;
  }
}
