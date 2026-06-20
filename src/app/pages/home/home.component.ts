import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ArticleService } from '../../services/article.service';
import { CategoryService } from '../../services/category.service';
import { iArticle } from '../../interfaces/article.interface';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private articleService = inject(ArticleService);
  private categoryService = inject(CategoryService);

  // ============================
  // ESTADO BASE
  // ============================
  allArticles = signal<iArticle[]>([]);
  loading = signal(true);
  error = signal(false);

  // Categoría desde queryParams (header)
  categoriaIds = signal<number[] | null>(null);
  tituloCategoria = signal<string | null>(null);

  // ============================
  // FILTROS (versión jueves)
  // ============================
  filters = signal({
    texto: '',
    categoria: '',
    estado: '',
    min: '',
    max: '',
    orden: 'recientes',
    localizacion: '',
    page: 1
  });

  // Categorías del CategoryService
  categories = this.categoryService.categories;

  // ============================
  // ARTÍCULOS FILTRADOS
  // ============================
  articles = computed(() => {
    let list = this.allArticles();
    const f = this.filters();
    const ids = this.categoriaIds();

    // Filtro por categoría desde queryParams
    if (ids && ids.length > 0) {
      list = list.filter(a => ids.includes(a.categorias_id));
    }

    // Filtro por categoría desde filtros
    if (f.categoria) {
      list = list.filter(a => a.categorias_id === Number(f.categoria));
    }

    // Texto
    if (f.texto) {
      list = list.filter(a =>
        a.titulo.toLowerCase().includes(f.texto.toLowerCase())
      );
    }

    // Estado
    if (f.estado) {
      list = list.filter(a => a.estado === f.estado);
    }

    // Precio mínimo
    if (f.min) {
      list = list.filter(a => a.precio >= Number(f.min));
    }

    // Precio máximo
    if (f.max) {
      list = list.filter(a => a.precio <= Number(f.max));
    }

    // Localización
    if (f.localizacion) {
      list = list.filter(a =>
        a.localizacion?.toLowerCase().includes(f.localizacion.toLowerCase())
      );
    }

    // Ordenación
    if (f.orden === 'precio_asc') {
      list = [...list].sort((a, b) => a.precio - b.precio);
    }
    if (f.orden === 'precio_desc') {
      list = [...list].sort((a, b) => b.precio - a.precio);
    }

    return list;
  });

  // ============================
  // PAGINACIÓN EN FRONTEND
  // ============================
  pageSize = 12;

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.articles().length / this.pageSize))
  );

  currentPage = computed(() => this.filters().page);

  paginatedArticles = computed(() => {
    const page = this.filters().page;
    const start = (page - 1) * this.pageSize;
    return this.articles().slice(start, start + this.pageSize);
  });

  // ============================
  // INIT
  // ============================
  ngOnInit(): void {

    // Leer queryParams del header
    this.route.queryParamMap.subscribe(params => {
      const cat = params.get('categoria');
      this.categoriaIds.set(cat ? cat.split(',').map(Number) : null);
      this.tituloCategoria.set(params.get('nombre'));
    });

    // Cargar artículos
    this.articleService.getAllUserArticles(null).subscribe({
      next: () => {
        this.allArticles.set(this.articleService.Articles());
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });

    // Cargar categorías
    this.categoryService.loadCategories();
  }

  // ============================
  // HANDLERS DE FILTROS
  // ============================
  updateFilter(key: string, value: any) {
    this.filters.update(f => ({ ...f, [key]: value, page: 1 }));
  }

  onSearchTextChange(v: string) { this.updateFilter('texto', v); }
  onCategoryChange(v: string) { this.updateFilter('categoria', v || ''); }
  onEstadoChange(v: string) { this.updateFilter('estado', v || ''); }
  onMinPriceChange(v: string) { this.updateFilter('min', v); }
  onMaxPriceChange(v: string) { this.updateFilter('max', v); }
  onOrdenChange(v: string) { this.updateFilter('orden', v); }
  onLocationChange(v: string) { this.updateFilter('localizacion', v); }

  resetFilters() {
    this.filters.set({
      texto: '',
      categoria: '',
      estado: '',
      min: '',
      max: '',
      orden: 'recientes',
      localizacion: '',
      page: 1
    });
  }

  // ============================
  // PAGINACIÓN
  // ============================
  changePage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.filters.update(f => ({ ...f, page }));
  }

  // ============================
  // NUEVO ARTÍCULO
  // ============================
  addNewArticle() {
    console.log('TODO: abrir modal o navegar');
  }
}
