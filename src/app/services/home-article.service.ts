import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeArticleService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/article/search';

  // Signals del buscador
  filters = signal({
    texto: '',
    categoria: null,
    estado: null,
    min: 0,
    max: 999999,
    orden: 'recientes',
    localizacion: null,
    page: 1
  });

  results = signal<any>(null);
  loading = signal(false);

  constructor() {}

  searchArticles() {
    this.loading.set(true);

    let params = new HttpParams();
    const f = this.filters();

    Object.entries(f).forEach(([key, value]) => {
      if (value !== null && value !== '' && value !== undefined) {
        params = params.set(key, value);
      }
    });

    this.http.get(this.apiUrl, { params }).subscribe({
      next: (res: any) => {
        this.results.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.results.set(null);
        this.loading.set(false);
      }
    });
  }

  updateFilter(key: string, value: any) {
    this.filters.update(f => ({ ...f, [key]: value }));
    this.searchArticles();
  }
  
  resetFilters() {
  this.filters.set({
    texto: '',
    categoria: null,
    estado: null,
    min: 0,
    max: 999999,
    orden: 'recientes',
    localizacion: null,
    page: 1
  });

  this.searchArticles();
} 
}