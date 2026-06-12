import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';


export interface VentasDia {
  dia: number;
  total: number;
}
@Injectable({
  providedIn: 'root',
})
export class TransactionsServices {

  private http = inject (HttpClient);
  private apiUrl = 'http://localhost:3000/api/transactions';

  // Obtener ventas al mes anuales

  getVentasAnuales(year:number){
    return this.http.get <{mes:number;total: number}[]>(`${this.apiUrl}/anual/${year}`);
  }

    // Ventas diarias de un mes
  getVentasMensuales(month: number, year: number) {
    return this.http.get<VentasDia[]>(
      `${this.apiUrl}/mensual/${month}?year=${year}`
    );
  }
}
