import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { iArticle } from '../../interfaces/article.interface';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  allArticles = signal<iArticle[]>([]);
  categoriaIds = signal<number[] | null>(null);
  tituloCategoria = signal<string | null>(null);
  loading = signal(true);
  error = signal(false);

  articles = computed(() => {
    const ids = this.categoriaIds();
    return ids && ids.length ? this.allArticles().filter(a => ids.includes(a.categorias_id)) : this.allArticles();
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const cat = params.get('categoria');
      this.categoriaIds.set(cat ? cat.split(',').map(Number) : null);
      this.tituloCategoria.set(params.get('nombre'));
    });

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
  }

  addNewArticle() {
    alert('Crear nuevo artículo\n(Placeholder - Vista de creación aún no implementada)');
  }
}
