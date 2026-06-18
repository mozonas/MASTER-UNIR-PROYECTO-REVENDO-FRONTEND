import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Article } from '../../shared/models/article.model';
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

  allArticles = signal<Article[]>([]);
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
          id: a.id,
          titulo: a.titulo,
          descripcion: a.descripcion,
          precio: a.precio,
          ubicacion: '',
          categorias_id: a.categorias_id,
          categoria_nombre: a.categoria_nombre ?? '',
          usuarios_id: a.usuarios_id,
          imagen: a.foto ?? '',
          estadoVenta: a.estadoVenta,
          estado_reporte: a.estado_reporte,
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
