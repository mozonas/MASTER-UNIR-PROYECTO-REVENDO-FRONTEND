import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminCategoryService {

  private baseUrl = 'http://localhost:3000/api/admin/categories';

  constructor(private http: HttpClient) {}

  // ============================
  //   TOKEN DEL ADMIN
  // ============================
  private getHeaders() {
    const token = sessionStorage.getItem('token') || ''; // igual que tu AuthService
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // ============================
  //   GET paginado
  // ============================
  getCategories(page: number = 1, limit: number = 20): Observable<any> {
    return this.http.get(
      `${this.baseUrl}?page=${page}&limit=${limit}`,
      this.getHeaders()
    );
  }

  // ============================
  //   POST crear categoría
  // ============================
  createCategory(nombre: string): Observable<any> {
    return this.http.post(
      this.baseUrl,
      { nombre },
      this.getHeaders()
    );
  }

  // ============================
  //   PUT actualizar categoría
  // ============================
  updateCategory(id: number, nombre: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${id}`,
      { nombre },
      this.getHeaders()
    );
  }

  // ============================
  //   DELETE eliminar categoría
  // ============================
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/${id}`,
      this.getHeaders()
    );
  }
}
