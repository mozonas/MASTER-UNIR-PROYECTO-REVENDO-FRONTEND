import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ArticleCardComponent } from '../../shared/components/article-card/article-card.component';
import { FilterHomeService } from '../../services/filterHome.service';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../interfaces/article.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ArticleCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private filterHomeService = inject(FilterHomeService);
  private articleService = inject(ArticleService);
  private router = inject(Router);

  allArticles = signal<Article[]>([]);
  categoriaIds = signal<number[] | null>(null);
  tituloCategoria = signal<string | null>(null);
  loading = signal(true);
  error = signal(false);

  filters = this.filterHomeService.filters;
  categories = this.filterHomeService.categories;
  results = signal<Article[]>([]);

  articles = computed(() => {
    const ids = this.categoriaIds();
    return ids && ids.length
      ? this.allArticles().filter(a => ids.includes(a.categorias_id))
      : this.allArticles();
  });

  hasActiveFilters = computed(() => {
    const f = this.filters();
    return !!(
      (f.texto && f.texto.trim() !== '') ||
      (f.categoria && f.categoria !== '') ||
      (f.estado && f.estado !== '') ||
      (f.min && f.min !== '') ||
      (f.max && f.max !== '') ||
      (f.localizacion && f.localizacion.trim() !== '') ||
      (f.orden && f.orden !== 'recientes')
    );
  });

  ngOnInit(): void {

    // 1) Escuchar cambios en la URL
/*     this.route.queryParamMap.subscribe(params => {
      const cat = params.get('categoria');
      this.categoriaIds.set(cat ? cat.split(',').map(Number) : null);

      // Obtener el nombre real desde categories()
      if (cat) {
        const id = Number(cat);
        const catObj = this.categories().find(c => c.id === id);
        this.tituloCategoria.set(catObj?.nombre ?? null);
      } else {
        this.tituloCategoria.set(null);
      }

      if (this.allArticles().length > 0) {
        this.results.set(this.articles());
      }
    }); */

    this.route.queryParamMap.subscribe(params => {
      const reset = params.get('reset');
      const cat = params.get('categoria');
      const nombreParam = params.get('nombre'); // <-- puede venir "Moda y accesorios"

      if (reset === '1') {
        this.filterHomeService.resetFilters();
      }

      if (cat) {
        this.filterHomeService.updateFilter('categoria', cat);
        this.categoriaIds.set(cat.split(',').map(Number));

        if (nombreParam) {
          this.tituloCategoria.set(decodeURIComponent(nombreParam));
        } else {
          const id = Number(cat);
          const catObj = this.categories().find(c => c.id === id);
          this.tituloCategoria.set(catObj?.nombre ?? null);
        }
      } else {
        if (reset === '1') {
          this.filterHomeService.updateFilter('categoria', '');
        }
        this.categoriaIds.set(null);
        this.tituloCategoria.set(null);
      }

      if (this.allArticles().length > 0) {
        this.loadFilteredResults();
      }
    });


    // CARGA INICIAL (Ahora utilizando tu servicio)
    this.articleService.getAllPublicArticles().subscribe({
      next: (articulosMapeados) => {
        this.allArticles.set(articulosMapeados);
        this.results.set(this.articles());
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });

    this.filterHomeService.loadCategories();
  }

  addNewArticle() {
    this.router.navigate(['/article-form']);
    
  }

  // ============================================================
  //   HANDLERS DEL BUSCADOR
  // ============================================================

  onSearchTextChange(value: string) {
    this.filterHomeService.updateFilter('texto', value);
    this.executeSearch();
  }

  onCategoryChange(value: string) {
    this.filterHomeService.updateFilter('categoria', value);
    this.executeSearch();
  }

  onEstadoChange(value: string) {
    this.filterHomeService.updateFilter('estado', value);
    this.executeSearch();
  }

  onMinPriceChange(value: string) {
    this.filterHomeService.updateFilter('min', value);
    this.executeSearch();
  }

  onMaxPriceChange(value: string) {
    this.filterHomeService.updateFilter('max', value);
    this.executeSearch();
  }

  onOrdenChange(value: string) {
    this.filterHomeService.updateFilter('orden', value);
    this.executeSearch();
  }

  onLocationChange(value: string) {
    this.filterHomeService.updateFilter('localizacion', value);
    this.executeSearch();
  }

/*   resetFilters() {
    this.filterHomeService.resetFilters();
    this.results.set(this.allArticles());
  } */
  resetFilters() {
    this.filterHomeService.resetFilters();
    this.router.navigate(['/home']); // sin params
    this.results.set(this.allArticles());
  }

  private loadFilteredResults(): void {
    if (this.hasActiveFilters()) {
      this.loading.set(true);
      this.filterHomeService.searchArticles().subscribe({
        next: (resp) => {
          const mapped = Array.isArray(resp?.data)
            ? resp.data.map((a: any) => (this.articleService as any).mapRawArticleToIArticle(a)).filter(Boolean)
            : [];

          this.results.set(mapped);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
      return;
    }

    this.results.set(this.articles());
  }

  // ============================================================
  //   LLAMADA CENTRAL AL BUSCADOR
  // ============================================================
  private executeSearch() {
    this.router.navigate([], {
    relativeTo: this.route,
    queryParams: {},
    replaceUrl: true
    });
    this.loading.set(true);

    this.filterHomeService.searchArticles().subscribe({
      next: (resp) => {
        // Hacemos que pase por tu mapeador centralizado del ArticleService
        // Nota: Si pasas esto directamente al FilterHomeService mediante RxJS, esta función se reduce a 3 líneas.
        const mapped = Array.isArray(resp?.data)
          ? resp.data.map((a: any) => (this.articleService as any).mapRawArticleToIArticle(a)).filter(Boolean)
          : [];

        this.results.set(mapped);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}