import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../interfaces/product.interface';
import { Article } from '../../../shared/models/article.model';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-user-page-sell',
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './user-page-sell.html',
  styleUrls: ['./user-page-sell.css'],
})
export class UserPageSell {
  private productService = inject(ProductService);

  products = this.productService.products;

  selectedFilter = signal<'all' | 'available' | 'sold' | 'reported'>('all');
  currentPage = signal(1);
  pageSize = 6;

  // 3. PROPIEDADES COMPUTADAS (COMPUTED SIGNALS)

  filteredarticles = computed(() => {
    const filter = this.selectedFilter();
    const allarticles = this.articles();
    const articlesArray = Array.isArray(allarticles) ? allarticles : [];
    if (filter === 'all') return articlesArray;
    return articlesArray.filter(p => p.estadoVenta === filter);
  });
  pageCount = computed(() => {
    return Math.max(1, Math.ceil(this.filteredarticles().length / this.pageSize));
  });
  pageNumbers = computed(() => {
    return Array.from({ length: this.pageCount() }, (_, index) => index + 1);
  });
  currentPagearticles = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const filtered = this.filteredarticles();
    const filteredArray = Array.isArray(filtered) ? filtered : [];
    return filteredArray.slice(start, start + this.pageSize);
  });

  currentPageArticles = computed<Article[]>(() =>
    this.currentPageProducts().map(p => ({
      id: Number(p.id),
      titulo: p.title,
      descripcion: p.description,
      precio: p.price,
      ubicacion: '',
      categorias_id: 0,
      usuarios_id: 0,
      imagen: p.image,
      estadoVenta: p.status === 'sold' ? 'VENDIDO' : p.status === 'reported' ? 'EN_REVISION' : 'DISPONIBLE',
      estado_reporte: p.status === 'reported' ? 1 : null,
    }))
  );

  setFilter(filter: 'all' | 'available' | 'sold' | 'reported') {
    this.selectedFilter.set(filter);
    this.currentPage.set(1);
  }
  setPage(page: number) {
    if (page < 1 || page > this.pageCount()) return;
    this.currentPage.set(page);
  }

  onEdit(article: Article): void {
    const product = this.products().find(p => Number(p.id) === article.id);
    if (product) {
      alert(`Editar producto: ${product.title}\n(Placeholder - Vista de edición aún no implementada)`);
    }
  }

  onDelete(article: Article): void {
    const product = this.products().find(p => Number(p.id) === article.id);
    if (!product) return;
    const confirmed = confirm(`¿Está seguro de que desea eliminar "${product.title}"? Esta acción no se puede deshacer.`);
    if (confirmed) {
      this.productService.deleteProduct(product.id);
      this.currentPage.set(Math.min(this.currentPage(), this.pageCount()));
    }
  }

  addNewProduct() {
    alert('Crear nuevo artículo\n(Placeholder - Vista de creación aún no implementada)');
  }

  getFilterCount(filter: 'all' | 'DISPONIBLE' | 'VENDIDO' | 'RESERVADO'): number {
    const allarticles = this.articles();
    const articlesArray = Array.isArray(allarticles) ? allarticles : [];
    if (filter === 'all') return articlesArray.length;
    return articlesArray.filter(p => p.estadoVenta === filter).length;
  }

  viewArticle(article: any) {
    console.log('Ver artículo:', article.id);
    this.router.navigate(['/article-detail', article.id]);
  }
}
