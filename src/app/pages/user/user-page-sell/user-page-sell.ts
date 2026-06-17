import { Component, inject, signal, computed } from '@angular/core';
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

  filteredProducts = computed(() => {
    const filter = this.selectedFilter();
    const allProducts = this.products();
    if (filter === 'all') return allProducts;
    return allProducts.filter(p => p.status === filter);
  });

  pageCount = computed(() => {
    return Math.max(1, Math.ceil(this.filteredProducts().length / this.pageSize));
  });

  pageNumbers = computed(() => {
    return Array.from({ length: this.pageCount() }, (_, index) => index + 1);
  });

  currentPageProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredProducts().slice(start, start + this.pageSize);
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

  getFilterCount(filter: 'all' | 'available' | 'sold' | 'reported'): number {
    if (filter === 'all') return this.products().length;
    return this.products().filter(p => p.status === filter).length;
  }
}
