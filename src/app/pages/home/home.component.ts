import { Component, OnInit, computed, inject } from '@angular/core';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { HomeArticleService } from '../../services/home-article.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-home',
  imports: [ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {

  private homeService = inject(HomeArticleService);
  private categoryService = inject(CategoryService);

  results = this.homeService.results;
  loading = this.homeService.loading;
  filters = this.homeService.filters;

  categories = this.categoryService.categories;

  items = computed(() => this.results()?.items ?? []);
  totalPages = computed(() => this.results()?.totalPages ?? 1);
  currentPage = computed(() => this.results()?.currentPage ?? 1);

  ngOnInit() {
    this.homeService.searchArticles();
    this.categoryService.loadCategories();
  }

  // -----------------------------
  // PAGINACIÓN
  // -----------------------------
  changePage(page: number) {
    this.homeService.updateFilter('page', page);
  }

  // -----------------------------
  // TEXTO
  // -----------------------------
  onSearchTextChange(value: string) {
    this.homeService.updateFilter('texto', value);
  }

  // -----------------------------
  // CATEGORÍA
  // -----------------------------
  onCategoryChange(value: string) {
    this.homeService.updateFilter('categoria', value || null);
  }

  // -----------------------------
  // ESTADO DE CONSERVACIÓN
  // -----------------------------
  onEstadoChange(value: string) {
    this.homeService.updateFilter('estado', value || null);
  }

  // -----------------------------
  // PRECIO MÍNIMO
  // -----------------------------
  onMinPriceChange(value: string) {
    const num = Number(value);
    this.homeService.updateFilter('min', isNaN(num) ? 0 : num);
  }

  // -----------------------------
  // PRECIO MÁXIMO
  // -----------------------------
  onMaxPriceChange(value: string) {
    const num = Number(value);
    this.homeService.updateFilter('max', isNaN(num) ? 999999 : num);
  }

  // -----------------------------
  // ORDENACIÓN
  // -----------------------------
  onOrdenChange(value: string) {
    this.homeService.updateFilter('orden', value);
  }

  // -----------------------------
  // LOCALIZACIÓN
  // -----------------------------
  onLocationChange(value: string) {
    this.homeService.updateFilter('localizacion', value || null);
  }

  // -----------------------------
  // RESET DE FILTROS
  // -----------------------------
  resetFilters() {
    this.homeService.resetFilters();
  }
}
