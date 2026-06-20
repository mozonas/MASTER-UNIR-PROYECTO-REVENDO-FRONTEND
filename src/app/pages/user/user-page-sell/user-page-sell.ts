import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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

  articles = this.articleService.Articles;

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

  // Ahora sí: devolvemos iArticle sin transformarlo
  currentPageArticles = computed<iArticle[]>(() =>
    this.currentPageRawArticles()
  );

  ngOnInit(): void {
    this.loadArticles();
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

  setFilter(filter: 'all' | 'DISPONIBLE' | 'VENDIDO' | 'RESERVADO') {
    this.selectedFilter.set(filter);
    this.currentPage.set(1);
  }

  setPage(page: number) {
    if (page < 1 || page > this.pageCount()) return;
    this.currentPage.set(page);
  }

  onEdit(article: iArticle): void {
    const original = this.articles().find(a => a.id === article.id);
    if (original) {
      alert(`Editar artículo: ${original.titulo}\n(Placeholder - Vista de edición aún no implementada)`);
    }
  }

  onDelete(article: iArticle): void {
    const original = this.articles().find(a => a.id === article.id);
    if (!original) return;

    const confirmed = confirm(`¿Está seguro de que desea eliminar "${original.titulo}"? Esta acción no se puede deshacer.`);
    if (confirmed) {
      this.articleService.deleteArticle(original.id);
      this.currentPage.set(Math.min(this.currentPage(), this.pageCount()));
    }
  }

  addNewArticle() {
    alert('Crear nuevo artículo\n(Placeholder - Vista de creación aún no implementada)');
  }

  getFilterCount(filter: 'all' | 'DISPONIBLE' | 'VENDIDO' | 'RESERVADO'): number {
    const all = this.articles();
    if (filter === 'all') return all.length;
    return all.filter(a => a.estadoVenta === filter).length;
  }
}
