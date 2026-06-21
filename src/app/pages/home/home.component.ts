import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { iArticle } from '../../interfaces/article.interface';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { FilterHomeService } from '../../services/filterHome.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private filterHomeService = inject(FilterHomeService);

  allArticles = signal<iArticle[]>([]);
  categoriaIds = signal<number[] | null>(null);
  tituloCategoria = signal<string | null>(null);
  loading = signal(true);
  error = signal(false);

  articles = computed(() => {
    const ids = this.categoriaIds();
    return ids && ids.length
      ? this.allArticles().filter(a => ids.includes(a.categorias_id))
      : this.allArticles();
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const cat = params.get('categoria');
      this.categoriaIds.set(cat ? cat.split(',').map(Number) : null);
      this.tituloCategoria.set(params.get('nombre'));
    });

    // CARGA INICIAL — ESTO ES LO QUE SE VE AL ENTRAR
    this.http.get<{ status: string; data: any[] }>('http://localhost:3000/api/articles').subscribe({
      next: (resp) => {
        this.allArticles.set(resp.data.map(a => ({
          id: String(a.id),
          titulo: String(a.titulo ?? ''),
          descripcion: String(a.descripcion ?? ''),
          precio: Number(a.precio ?? 0),
          categorias_id: Number(a.categorias_id ?? 0),
          categoria_nombre: a.categoria_nombre ? String(a.categoria_nombre) : '',
          usuarios_id: Number(a.usuarios_id ?? 0),
          image: a.image ?? a.foto ?? null,
          fotos: Array.isArray(a.fotos)
            ? a.fotos
                .filter((foto: any) => foto && typeof foto.url === 'string' && foto.url.trim())
                .map((foto: any) => ({
                  url: String(foto.url).trim(),
                  nombreAlt: String(foto.nombreAlt ?? ''),
                }))
            : undefined,
          estadoVenta: String(a.estadoVenta ?? 'DISPONIBLE'),
          estadoProducto: a.estadoProducto ? String(a.estadoProducto) : undefined,
          tipoEntrega: String(a.tipoEntrega ?? ''),
          tipoPago: String(a.tipoPago ?? ''),
          created_at: a.created_at ? new Date(a.created_at) : new Date(),
          estado_reporte: a.estado_reporte != null ? Number(a.estado_reporte) : null,
        })));
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
    alert('Crear nuevo artículo\n(Placeholder - Vista de creación aún no implementada)');
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

  resetFilters() {
    this.filterHomeService.resetFilters();
    this.results.set(this.allArticles());   // ← VUELVE AL ESTADO INICIAL
  }

  // ============================================================
  //   LLAMADA CENTRAL AL BACKEND (solo cuando hay filtros)
  // ============================================================

  private executeSearch() {
    this.loading.set(true);

    this.filterHomeService.searchArticles().subscribe({
      next: (resp) => {

        const mapped: Article[] = resp.data.map(a => ({
          id: Number(a.id),
          titulo: a.titulo,
          descripcion: a.descripcion,
          precio: a.precio,
          ubicacion: '',
          categorias_id: a.categorias_id,
          categoria_nombre: '',
          usuarios_id: a.usuarios_id,
          imagen: a.foto ?? '',
          estadoVenta: (a.estadoVenta as string).toUpperCase().trim() as Article['estadoVenta'],
          estado_reporte: a.estado_reporte
        }));

        this.results.set(mapped);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
