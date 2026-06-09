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

    // Traer articulos del usuario de la BBDD
    getAllUserArticles(): Observable<iArticle[]> {
        return this.http.get<iArticle[] | { articles?: iArticle[] }>(
            `${this.apiUrl}/userarticles`
        ).pipe(
          tap(raw => console.log('RAW userarticles response:', raw)),
          map(response => this.normalizeArticlesResponse(response)),
          tap(respuesta => {
            // update the shared Articles signal so components render DB data
            this.Articles.set(respuesta);
            console.log('Datos recibidos de articulos:', respuesta);
          })
        );
      }

  private normalizeArticlesResponse(response: iArticle[] | { articles?: any[] } | { userarticles?: any[] } | { data?: any[] } | any): iArticle[] {
    let rawArticles: any[] = [];

    if (Array.isArray(response)) {
      rawArticles = response;
    } else if (response && Array.isArray(response.articles)) {
      rawArticles = response.articles;
    } else if (response && Array.isArray(response.userarticles)) {
      rawArticles = response.userarticles;
    } else if (response && Array.isArray(response.data)) {
      rawArticles = response.data;
    }

    return rawArticles
      .map(item => this.mapRawArticleToIArticle(item))
      .filter((article): article is iArticle => !!article);
  }

  private mapRawArticleToIArticle(item: any): iArticle | null {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const estadoRaw = (item.estadoVenta || item.status || item.estado || '').toString().toLowerCase();
  let estadoVenta: iArticle['estadoVenta'] = 'DISPONIBLE';
  
  if (estadoRaw.includes('vend')) {
    estadoVenta = 'VENDIDO';
  } else if (estadoRaw.includes('report') || estadoRaw.includes('reserv') || item.estado_reporte) {
   
    estadoVenta = 'RESERVADO';
  }

  const createdAtValue = item.created_at || item.createdAt || item.fecha || item.date;
  const createdAt = createdAtValue ? new Date(createdAtValue) : new Date();

  return {
    id: String(item.id ?? item._id ?? ''),
    titulo: item.titulo || item.title || item.name || '',
    descripcion: item.descripcion || item.description || item.desc || '',
    precio: Number(item.precio ?? item.price ?? 0),
    
    image: item.foto || item.image || item.imagen || item.img || '', 
    
    estadoVenta,
    
    estadoProducto: item.estadoProducto || 'Nuevo', 
    
    tipoEntrega: item.tipoEntrega || item.deliveryType || 'Envío',
    tipoPago: item.tipoPago || item.paymentType || 'Efectivo',
    created_at: createdAt,
    usuarios_id: item.usuarios_id || item.userId || item.user_id || '',
    categorias_id: item.categorias_id || item.categoryId || item.categoria_id || '',
    
    estado_reporte: item.estado_reporte || null 
  };
}

  Articles = signal<iArticle[]>([]);

  getArticleById(id: string): iArticle | undefined {
    return this.Articles().find(p => p.id === id);
  }

  deleteArticle(id: string): void {
    const updatedArticles = this.Articles().filter(p => p.id !== id);
    this.Articles.set(updatedArticles);
  }

  updateArticle(id: string, updatedArticle: Partial<iArticle>): void {
    const articles = [...this.Articles()];
    const index = articles.findIndex(p => p.id === id);
    if (index !== -1) {
      articles[index] = { ...articles[index], ...updatedArticle };
      this.Articles.set(articles);
    }
  }
}

