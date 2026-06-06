import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ArticleService } from '../../../services/article.service';
import { Product } from '../../../interfaces/product.interface';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-user-page-sell',
  imports: [CommonModule, FooterComponent],
  templateUrl: './user-page-sell.html',
  styleUrls: ['./user-page-sell.css'],
})
export class UserPageSell {
  private articleService = inject(ArticleService);
  private router = inject(Router);

  articles = this.articleService.articles;

  selectedFilter = signal<'all' | 'available' | 'sold' | 'reported'>('all');
  currentPage = signal(1);
  pageSize = 6;

  filteredarticles = computed(() => {
    const filter = this.selectedFilter();
    const allarticles = this.articles();
    if (filter === 'all') return allarticles;
    return allarticles.filter(p => p.status === filter);
  });

  pageCount = computed(() => {
    return Math.max(1, Math.ceil(this.filteredarticles().length / this.pageSize));
  });

  pageNumbers = computed(() => {
    return Array.from({ length: this.pageCount() }, (_, index) => index + 1);
  });

  currentPagearticles = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredarticles().slice(start, start + this.pageSize);
  });

  setFilter(filter: 'all' | 'available' | 'sold' | 'reported') {
    this.selectedFilter.set(filter);
    this.currentPage.set(1);
  }

  setPage(page: number) {
    if (page < 1 || page > this.pageCount()) {
      return;
    }
    this.currentPage.set(page);
  }

  editProduct(product: Product) {
    console.log('Editar producto:', product);
    // TODO: Navegar a la vista de edición de artículo cuando esté disponible
    alert(`Editar producto: ${product.title}\n(Placeholder - Vista de edición aún no implementada)`);
  }

  addNewProduct() {
    console.log('Agregar nuevo producto');
    // TODO: Navegar a la vista de crear nuevo artículo cuando esté disponible
    alert('Crear nuevo artículo\n(Placeholder - Vista de creación aún no implementada)');
  }

  deleteProduct(product: Product) {
    const confirmed = confirm(`¿Está seguro de que desea eliminar "${product.title}"? Esta acción no se puede deshacer.`);
    
    if (confirmed) {
      this.articleService.deleteProduct(product.id);
      this.currentPage.set(Math.min(this.currentPage(), this.pageCount()));
      console.log('Producto eliminado:', product.title);
    }
  }

  getStatusBadgeClass(status: string): string {
    return status === 'sold' ? 'badge-danger' : status === 'reported' ? 'badge-warning' : 'badge-success';
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'sold':
        return 'Vendido';
      case 'reported':
        return 'Reportado';
      default:
        return 'Disponible';
    }
  }

  getFilterCount(filter: 'all' | 'available' | 'sold' | 'reported'): number {
    if (filter === 'all') return this.articles().length;
    return this.articles().filter(p => p.status === filter).length;
  }
}
