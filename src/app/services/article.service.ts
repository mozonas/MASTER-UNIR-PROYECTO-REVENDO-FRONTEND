import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { iArticle } from '../interfaces/article.interface';
import { map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ArticleService {

 private http = inject(HttpClient);
 private apiUrl = 'http://localhost:3000/api';

  /**
   * Obtiene un producto específico por su ID
   * @param id 
   * @returns 
   */
  getArticleById(id: string): Observable<iArticle | undefined> {
    return this.http.get<any>(`${this.apiUrl}/article/${id}`).pipe(
      map(response => response.data)
    );
  }

    getAllUserArticles(userId?: number | null): Observable<iArticle[]> {
      const baseUrl = `${this.apiUrl}/user-sell`;
      const url = userId ? `${baseUrl}/${userId}` : baseUrl;

      return this.http.get<iArticle[] | { data?: any[]; articles?: any[] }>(url).pipe(
        tap(raw => console.log('RAW userarticles response:', raw)),
        map(response => this.normalizeArticlesResponse(response)),
        tap(respuesta => {
          this.Articles.set(respuesta);
          console.log('Datos recibidos de articulos:', respuesta);
        })
      );
    }

  private normalizeArticlesResponse(response: any): iArticle[] {
    const rawArticles: any[] = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.articles)
      ? response.articles
      : Array.isArray(response)
      ? response
      : [];

    return rawArticles
      .map(articulo => this.mapRawArticleToIArticle(articulo))
      .filter((article): article is iArticle => !!article);
  }

  private mapRawArticleToIArticle(articulo: any): iArticle | null {
  if (!articulo || typeof articulo !== 'object') {
    return null;
  }

  const estadoRaw = (articulo.estadoVenta || '').toString().toLowerCase();
  let estadoVenta: iArticle['estadoVenta'] = 'DISPONIBLE';
  if (estadoRaw === 'vendido') {
    estadoVenta = 'VENDIDO';
  } else if (estadoRaw === 'reservado') {
    estadoVenta = 'RESERVADO';
  }
   
  const createdAtValue = articulo.createdAt;
  const createdAt = createdAtValue ? new Date(createdAtValue) : new Date();

  return {
    id: String(articulo.id ?? ''),
    titulo: String(articulo.titulo ?? ''),
    descripcion: String(articulo.descripcion ?? ''),
    precio: Number(articulo.precio ?? 0),
    estadoVenta,
    estadoProducto: articulo.estadoProducto ? String(articulo.estadoProducto) : undefined,
    tipoEntrega: String(articulo.tipoEntrega ?? ''),
    tipoPago: String(articulo.tipoPago ?? ''),
    created_at: createdAt,
    usuarios_id: Number(articulo.usuarios_id ?? 0),
    categorias_id: Number(articulo.categorias_id ?? 0),
    image: articulo.foto ?? null,
    estado_reporte: articulo.estado_reporte != null ? Number(articulo.estado_reporte) : null
  };
}

  Articles = signal<iArticle[]>([]);

   deleteArticle(id: string): void {
    const updatedArticles = this.Articles().filter(a => a.id !== id);
    this.Articles.set(updatedArticles);
  }

  updateArticle(id: string, updatedArticle: Partial<iArticle>): void {
    const articles = [...this.Articles()];
    const index = articles.findIndex(a => a.id === id);
    if (index !== -1) {
      articles[index] = { ...articles[index], ...updatedArticle };
      this.Articles.set(articles);
    }
  }
}

