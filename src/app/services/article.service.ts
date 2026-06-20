import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { iArticle } from '../interfaces/article.interface';

export interface ArticleUpsertPayload {
  titulo: string;
  descripcion: string;
  precio: number;
  estadoProducto?: string | null;
  tipoEntrega: string;
  tipoPago: string;
  categorias_id: number | string;
  images?: string[];
}

export interface ArticleEnumsPayload {
  categorias: Array<{ id: number; nombre: string }>;
  estadoProducto: string[];
  tipoEntrega: string[];
  tipoPago: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  Articles = signal<iArticle[]>([]);

  getArticleById(id: string): Observable<iArticle | undefined> {
    return this.http.get<any>(`${this.apiUrl}/article/${id}`).pipe(
      map(response => {
        const rawArticle = Array.isArray(response?.data)
          ? response.data[0]
          : response?.data ?? response?.article ?? response;
        return this.mapRawArticleToIArticle(rawArticle);
      })
    );
  }

  getUserArticleForEdit(id: string): Observable<iArticle | undefined> {
    return this.http.get<any>(`${this.apiUrl}/user-sell/article/${id}`).pipe(
      map(response => {
        const rawArticle = response?.data ?? response?.article ?? response;
        return this.mapRawArticleToIArticle(rawArticle);
      })
    );
  }

  getAllUserArticles(userId?: number | null, estado: string = 'all'): Observable<iArticle[]> {
    const baseUrl = `${this.apiUrl}/user-sell`;
    const url = userId ? `${baseUrl}/${userId}` : baseUrl;
    const params = estado && estado !== 'all' ? new HttpParams({ fromObject: { estado } }) : undefined;

    return this.http.get<iArticle[] | { data?: any[]; articles?: any[] }>(url, params ? { params } : {}).pipe(
      tap(raw => console.log('RAW userarticles response:', raw)),
      map(response => this.normalizeArticlesResponse(response)),
      tap(respuesta => {
        this.Articles.set(respuesta);
        console.log('Datos recibidos de articulos:', respuesta);
      })
    );
  }

  createArticle(article: ArticleUpsertPayload, userId?: number): Observable<any> {
    const payload = userId ? { ...article, usuarios_id: userId } : article;
    return this.http.post<any>(`${this.apiUrl}/user-sell${userId ? `/${userId}` : ''}`, payload);
  }

  updateArticle(id: string, updatedArticle: Partial<ArticleUpsertPayload>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/user-sell/${id}`, updatedArticle);
  }

  deleteArticle(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/user-sell/${id}`);
  }

  getArticleEnums(): Observable<ArticleEnumsPayload> {
    return this.http.get<any>(`${this.apiUrl}/article/enums`).pipe(
      map(response => response?.data ?? response)
    );
  }

  getEnums(): Observable<ArticleEnumsPayload> {
    return this.getArticleEnums();
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

  private mapRawArticleToIArticle(articulo: any): iArticle | undefined {
    if (!articulo || typeof articulo !== 'object') {
      return undefined;
    }

    const estadoRaw = (articulo.estadoVenta ?? '').toString().toUpperCase();
    let estadoVenta: iArticle['estadoVenta'] = 'DISPONIBLE';
    if (estadoRaw === 'VENDIDO') {
      estadoVenta = 'VENDIDO';
    } else if (estadoRaw === 'RESERVADO') {
      estadoVenta = 'RESERVADO';
    } else if (estadoRaw === 'BORRADO') {
      estadoVenta = 'BORRADO';
    }

    const createdAtValue = articulo.created_at ?? articulo.createdAt;
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
      categoria_nombre: articulo.categoria_nombre ? String(articulo.categoria_nombre) : (articulo.categoria ? String(articulo.categoria) : undefined),
      image: articulo.image ?? articulo.foto ?? articulo.url ?? null,
      estado_reporte: articulo.estado_reporte != null ? Number(articulo.estado_reporte) : null
    } as iArticle;
  }
}