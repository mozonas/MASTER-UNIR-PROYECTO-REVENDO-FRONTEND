import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {VentasMes} from '../interfaces/ventas.interface';
import { PubStats } from '../interfaces/pub-stats.interface';
import { Article } from '../interfaces/article.interface';

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
  private backendUrl = 'http://localhost:3000';

  Articles = signal<Article[]>([]);

  getArticleById(id: string): Observable<Article | undefined> {
    return this.http.get<any>(`${this.apiUrl}/article/${id}`).pipe(
      map(response => {
        const rawArticle = Array.isArray(response?.data)
          ? response.data[0]
          : response?.data ?? response?.article ?? response;
        return this.mapRawArticleToIArticle(rawArticle);
      })
    );
  }

  getUserArticleForEdit(id: string): Observable<Article | undefined> {
    return this.http.get<any>(`${this.apiUrl}/user-sell/article/${id}`).pipe(
      map(response => {
        const rawArticle = response?.data ?? response?.article ?? response;
        return this.mapRawArticleToIArticle(rawArticle);
      })
    );
  }

  getAllUserArticles(userId?: number | null, estado: string = 'all'): Observable<Article[]> {
    const baseUrl = `${this.apiUrl}/user-sell`;
    const url = userId ? `${baseUrl}/${userId}` : baseUrl;
    const params = estado && estado !== 'all' ? new HttpParams({ fromObject: { estado } }) : undefined;

    return this.http.get<Article[] | { data?: any[]; articles?: any[] }>(url, params ? { params } : {}).pipe(
      tap(raw => console.log('RAW userarticles response:', raw)),
      map(response => this.normalizeArticlesResponse(response)),
      tap(respuesta => {
        this.Articles.set(respuesta);
        console.log('Datos recibidos de articulos:', respuesta);
      })
    );
  }

  // Añade esto dentro de tu ArticleService
  getAllPublicArticles(): Observable<Article[]> {
    return this.http.get<any>(`${this.apiUrl}/articles`).pipe(
      map(response => this.normalizeArticlesResponse(response))
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
    return this.http.delete<any>(`${this.apiUrl}/user-sell/${id}`).pipe(
      tap(() => {
        this.Articles.update((articles) => articles.filter((article) => article.id !== id));
      })
    );
  }

  findLoadedArticleById(id: number | string): Article | undefined {
    return this.Articles().find((article) => article.id === String(id));
  }

  getArticleImageUrls(article: Pick<Article, 'image' | 'fotos'>): string[] {
    const primary = this.resolveImageUrl(article.image, '');
    const gallery = (article.fotos ?? [])
      .map((foto) => this.resolveImageUrl(foto.url, ''))
      .filter((url): url is string => !!url);

    const candidates = [...gallery, primary].filter((url): url is string => !!url);
    return [...new Set(candidates)];
  }

  resolveImageUrl(value: unknown, fallback: string = '/images/placeholder_articulo.png'): string {
    const normalized = this.normalizeImagePath(value);
    if (!normalized) {
      return fallback;
    }

    if (/^(https?:)?\/\//i.test(normalized) || normalized.startsWith('data:')) {
      return normalized;
    }

    const relativePath = normalized.startsWith('/') ? normalized : `/${normalized}`;
    return `${this.backendUrl}${relativePath}`;
  }

  getArticleEnums(): Observable<ArticleEnumsPayload> {
    return this.http.get<any>(`${this.apiUrl}/article/enums`).pipe(
      map(response => response?.data ?? response)
    );
  }

  getEnums(): Observable<ArticleEnumsPayload> {
    return this.getArticleEnums();
  }

  private normalizeArticlesResponse(response: any): Article[] {
    const rawArticles: any[] = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.articles)
        ? response.articles
        : Array.isArray(response)
          ? response
          : [];

    return rawArticles
      .map(articulo => this.mapRawArticleToIArticle(articulo))
      .filter((article): article is Article => !!article);
  }

  private mapRawArticleToIArticle(articulo: any): Article | undefined {
    if (!articulo || typeof articulo !== 'object') {
      return undefined;
    }

    const estadoRaw = (articulo.estadoVenta ?? '').toString().toUpperCase();
    let estadoVenta: Article['estadoVenta'] = 'DISPONIBLE';
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
      image: this.normalizeImagePath(articulo.image ?? articulo.foto ?? articulo.url),
      fotos: Array.isArray(articulo.fotos)
        ? articulo.fotos
          .filter((foto: any) => foto && typeof foto.url === 'string' && foto.url.trim())
          .map((foto: any) => ({
            url: String(foto.url).trim(),
            nombreAlt: String(foto.nombreAlt ?? ''),
          }))
        : undefined,
      estado_reporte: articulo.estado_reporte != null ? Number(articulo.estado_reporte) : null,
      seller: articulo.seller && typeof articulo.seller === 'object'
        ? {
          nombre: articulo.seller.nombre ? String(articulo.seller.nombre) : undefined,
          apellidos: articulo.seller.apellidos ? String(articulo.seller.apellidos) : undefined,
        }
        : undefined,
    } as Article;
  }

  private normalizeImagePath(value: unknown): string | null {
    if (typeof value !== 'string') {
      return null;
    }

    let trimmed = value.trim();
    if (!trimmed || trimmed === 'undefined' || trimmed === 'null') {
      return null;
    }

    trimmed = trimmed.replace(/^\|+/, '');
    trimmed = trimmed.replace(/^['"]+|['"]+$/g, '');
    trimmed = trimmed.replace(/\\/g, '/');
    trimmed = trimmed.replace(/^(https?:\/\/)(https?:\/\/)+/i, '$1');

    if (trimmed.startsWith('//')) {
      trimmed = `https:${trimmed}`;
    }

    if (trimmed.startsWith('www.')) {
      trimmed = `https://${trimmed}`;
    }

    return trimmed;
  }

   // Artículos publicados este mes
    getPubThisMonth():Observable <PubStats> {
      return this.http.get<{ total: number }>(`${this.apiUrl}/article/published/this-month`);
    }
  
    // Artículos publicados el mes pasado
    getPubLastMonth(): Observable<PubStats> {
      return this.http.get<{ total: number }>(`${this.apiUrl}/article/published/last-month`);
    }
  
    // Articulos vendidos este mes
     getVentasMensuales(month: number): Observable<VentasMes[]> {
      return this.http.get<VentasMes[]>(`${this.apiUrl}/article/sold/${month}`);
    }
    // Articulos vendidos este año
    getVentasAnuales(year:number): Observable<{mes:number;total: number}[]>  {
      return this.http.get<{mes:number;total: number}[]>(`${this.apiUrl}/article/sold/year/${year}`);
    }
}