import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/messages';

  getMensajesPorArticulo(articuloId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/articulo/${articuloId}`);
  }

  getConversacionesPorUsuario(usuarioId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  enviarMensaje(mensaje: { contenido: string; usuarios_id: number; articulos_id: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, mensaje);
  }

  eliminarMensaje(mensajeId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${mensajeId}`);
  }

}


