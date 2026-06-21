import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { iArticle } from '../interfaces/article.interface';

@Injectable({
  providedIn: 'root'
})
export class FilterHomeService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  // Filtros activos
  filters = signal({
    texto: '',
    categoria: '',
    estado: '',
    min: '',
    max: '',
    orden: 'recientes',
    localizacion: ''
  });

  // Categorías cargadas del backend
  categories = signal<any[]>([]);

  constructor() {}

  // ============================
  //   CATEGORÍAS DESDE EL BACK
  // ============================
  loadCategories(): void {
    this.http.get<{ status: string; data: any[] }>(`${this.apiUrl}/categories`)
      .subscribe({
        next: (res) => this.categories.set(res.data),
        error: (err) => console.error('Error cargando categorías:', err)
      });
  }

  // ============================
  //   ACTUALIZAR FILTROS
  // ============================
  updateFilter(key: string, value: any): void {
    this.filters.update(f => ({ ...f, [key]: value }));
  }

  resetFilters(): void {
    this.filters.set({
      texto: '',
      categoria: '',
      estado: '',
      min: '',
      max: '',
      orden: 'recientes',
      localizacion: ''
    });
  }

  // ============================
  //   LLAMADA AL BACKEND
  // ============================
  searchArticles(): Observable<{ status: string; data: iArticle[] }> {
    const f = this.filters();

    let params = new HttpParams()
    .set('texto', f.texto ?? '')
    .set('categoria', f.categoria ?? '')
    .set('estado', f.estado ?? '')
    .set('min', f.min ?? '')
    .set('max', f.max ?? '')
    .set('orden', f.orden ?? '')
    .set('localizacion', f.localizacion ?? '');


    return this.http.get<{ status: string; data: iArticle[] }>(
      `${this.apiUrl}/filters/search`,
      { params }
    );

  }
}
