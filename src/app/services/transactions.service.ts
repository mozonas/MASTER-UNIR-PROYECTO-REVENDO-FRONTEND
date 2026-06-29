import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class TransactionsServices {

  private http = inject (HttpClient);
  private apiUrl = 'http://localhost:3000/api/transactions';

  //** Ruta del back para obtener usuarios activos mes actual y mes anterior */
  getActiveUsers(): Observable<{ mesActual: number; mesAnterior: number }> {
  return this.http.get<{ mesActual: number; mesAnterior: number }>(
    `${this.apiUrl}/active-users`
  );
}

  //** Compra de un artículo: crea la transacción y lo marca como VENDIDO */
  comprar(articleId: string | number, usuariosId: number): Observable<{ message: string; transaccionId: number }> {
    return this.http.post<{ message: string; transaccionId: number }>(
      `${this.apiUrl}/comprar/${articleId}`,
      { usuarios_id: usuariosId }
    );
  }

}
