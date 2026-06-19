import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  categories = signal<any[]>([]);
  loading = signal(false);

  loadCategories() {
    this.loading.set(true);

    this.http.get<any>(`${this.apiUrl}/categories`)
      .subscribe({
        next: (res) => {
          this.categories.set(res.data);   // ← ahora sí
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error cargando categorías:', err);
          this.loading.set(false);
        }
      });
  }
}
