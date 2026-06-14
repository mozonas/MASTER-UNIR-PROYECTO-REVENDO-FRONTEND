import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionsServices {

  private http = inject (HttpClient);
  private apiUrl = 'http://localhost:3000/api/transactions';

  // Obtener ventas al mes anuales

  getVentasAnuales(year:number): Observable<any> {
    return this.http.get <any>(`${this.apiUrl}/anual`,{params: { year }
    });
   
  }


}
