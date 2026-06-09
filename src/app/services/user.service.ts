import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/user.interface';
import { EstadisticasUsuario } from '../interfaces/valoration.interface';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/users';

    /**
     * Obtiene el perfil de un usuario específico por su ID
     */
    getPerfilUsuario(id: number): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
    }

    /**
     * Actualiza los datos del perfil de un usuario específico
     */
    updatePerfilUsuario(id: number, datos: Partial<Usuario>): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, datos);
    }

    /**
     * Obtiene las estadísticas reales de ventas y valoraciones agregadas de la base de datos
     */
    getEstadisticasUsuario(id: number): Observable<EstadisticasUsuario> {
        return this.http.get<EstadisticasUsuario>(`${this.apiUrl}/${id}/estadisticas`);
    }

    /**
     * Obtiene las valoraciones reales de un usuario específico desde la base de datos
     */
    getValoracionesUsuario(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}/valoraciones`);
    }
}