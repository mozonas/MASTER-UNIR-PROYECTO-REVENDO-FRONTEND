import { Component, Input, OnChanges, OnInit, SimpleChanges, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../../services/article.service';
import { AuthService } from '../../../services/auth.service';
import { Article } from '../../../interfaces/article.interface';
import { ArticleCardComponent } from '../../../shared/components/article-card/article-card.component';

@Component({
  selector: 'app-user-page-sell',
  imports: [CommonModule, FormsModule, ArticleCardComponent],
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
  reportedArticles = signal<Article[]>([]);

  isAdminViewing: boolean = false;


  selectedFilter = signal<'all' | 'DISPONIBLE' | 'VENDIDO' | 'REPORTADO'>('all');
  currentPage = signal(1);
  pageSize = 6;

  filteredArticles = computed(() => {
    const filter = this.selectedFilter();
    const all = this.articles();
    if (filter === 'all') return all;

    if (filter === 'REPORTADO') {
      return this.reportedArticles();
    }

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

  currentPageArticles = computed<Article[]>(() => this.currentPageRawArticles());

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

  private loadArticles(estado: 'all' | 'REPORTADO' = 'all'): void {
    const userId = this.resolveUserId();

    if (!userId) {
      console.error('No se pudo obtener el ID de usuario para cargar los artículos.');
      return;
    }

    this.articleService.getAllUserArticles(userId, estado).subscribe({
      error: (error) => console.error('Error al cargar artículos:', error),
    });
  }

  private loadReportedArticles(): void {
    const userId = this.resolveUserId();

    if (!userId) {
      console.error('No se pudo obtener el ID de usuario para cargar los artículos reportados.');
      return;
    }

    this.articleService.getReportedUserArticles(userId).subscribe({
      next: (articles) => {
        this.reportedArticles.set(articles);
      },
      error: (error) => {
        console.error('Error al cargar artículos reportados:', error);
        this.reportedArticles.set([]);
      }
    });
  }

  setFilter(filter: 'all' | 'DISPONIBLE' | 'VENDIDO' | 'REPORTADO') {
    this.selectedFilter.set(filter);
    this.currentPage.set(1);

    if (filter === 'REPORTADO') {
      this.loadReportedArticles();
      return;
    }

    this.loadArticles('all');
  }

  setPage(page: number) {
    if (page < 1 || page > this.pageCount()) return;
    this.currentPage.set(page);
  }

  onEdit(article: Article): void {
    if (!this.canManageArticle(article)) {
      return;
    }

    void this.router.navigate(['/article-form', article.id]);
  }

  onDelete(article: Article): void {
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

  mostrarModalVenta = signal(false);
  articuloEnVenta = signal<Article | null>(null);
  metodoPagoVenta = signal('Efectivo');
  precioVenta = signal(0);
  enviandoVenta = signal(false);
  errorVenta = signal('');

  onMarcarVendido(article: Article): void {
    if (!this.canManageArticle(article)) {
      return;
    }

    this.articuloEnVenta.set(article);
    this.metodoPagoVenta.set(article.tipoPago || 'Efectivo');
    this.precioVenta.set(article.precio);
    this.errorVenta.set('');
    this.mostrarModalVenta.set(true);
  }

  cerrarModalVenta(): void {
    this.mostrarModalVenta.set(false);
    this.articuloEnVenta.set(null);
  }

  confirmarVenta(): void {
    const articulo = this.articuloEnVenta();
    if (!articulo || this.precioVenta() <= 0) {
      this.errorVenta.set('Indica un precio válido.');
      return;
    }

    this.enviandoVenta.set(true);
    this.errorVenta.set('');

    this.articleService.marcarVendido(articulo.id, {
      tipoPago: this.metodoPagoVenta(),
      precio: this.precioVenta(),
    }).subscribe({
      next: () => {
        this.enviandoVenta.set(false);
        this.cerrarModalVenta();
      },
      error: (error) => {
        console.error('Error al marcar como vendido:', error);
        this.errorVenta.set(error?.error?.message || 'Error al registrar la venta. Inténtalo de nuevo.');
        this.enviandoVenta.set(false);
      }
    });
  }

  addNewArticle() {
    void this.router.navigate(['/article-form']);
  }

  canManageArticle(article: Article): boolean {
    if (this.authService.getUserRole() === 'MODERADOR') {
      return true;
    }

    return this.authService.getUserId() === article.usuarios_id;
  }

  getFilterCount(filter: 'all' | 'DISPONIBLE' | 'VENDIDO' | 'REPORTADO'): number {
    const all = this.articles();
    if (filter === 'all') return all.length;

    if (filter === 'REPORTADO') {
      return this.reportedArticles().length;
    }

    return all.filter(a => a.estadoVenta === filter).length;
  }
}
