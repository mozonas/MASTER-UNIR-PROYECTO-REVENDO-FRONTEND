import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { iArticle } from '../interfaces/article.interface';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

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
    let params = new HttpParams();

    if (f.texto) params = params.set('texto', f.texto);
    if (f.categoria) params = params.set('categoria', f.categoria);
    if (f.estado) params = params.set('estado', f.estado);
    if (f.min) params = params.set('min', f.min);
    if (f.max) params = params.set('max', f.max);
    if (f.orden) params = params.set('orden', f.orden);
    if (f.localizacion) params = params.set('localizacion', f.localizacion);

    return this.http.get<{ status: string; data: iArticle[] }>(
      `${this.apiUrl}/filters/search`,
      { params }
    );

  }
}
