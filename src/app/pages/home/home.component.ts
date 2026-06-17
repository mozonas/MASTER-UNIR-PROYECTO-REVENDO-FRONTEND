import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Article } from '../../shared/models/article.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { HeaderMenuComponent } from '../../shared/headers/header-menu/header-menu.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ProductCardComponent, HeaderMenuComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  allArticles = signal<Article[]>([]);
  categoriaId = signal<number | null>(null);
  loading = signal(true);
  error = signal(false);

  articles = computed(() => {
    const id = this.categoriaId();
    return id ? this.allArticles().filter(a => a.categorias_id === id) : this.allArticles();
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const cat = params.get('categoria');
      this.categoriaId.set(cat ? Number(cat) : null);
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
}
