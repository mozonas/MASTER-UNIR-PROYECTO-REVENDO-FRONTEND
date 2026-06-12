import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {

  private apiUrl = 'http://localhost:3000/api/admin/users';

  constructor(private http: HttpClient) {}

  getUsers(page: number = 1, limit: number = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    return this.http.get<any>(this.apiUrl, { params });
  }
  // Método para bloquear o desbloquear un usuario
  toggleBlockUser(id: number, isBlocked: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { isBlocked });
  }
  // Método para eliminar un usuario
  deleteUser(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}


}
