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

    /**
     * Obtiene los usuarios del mes actual y anterior
     */
    getUserStats(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/stats/users`);
    }

    // getUserStats(): Observable<any> {
    //     return this.http.get<any>(`${this.apiUrl}/stats/users`);////ojo ruta ok? repetida justo arriba
    // }

    /**
     * Comprueba dinámicamente si el comprador tiene transacciones legítimas
     * pendientes de valorar con el vendedor especificado en la base de datos.
     */
    getTransaccionPendiente(vendedorId: number, compradorId: number): Observable<any> {
        return this.http.get<any>(
            `${this.apiUrl}/check/transaccion-pendiente?vendedorId=${vendedorId}&compradorId=${compradorId}`
        );
    }

    /**
     * Envía una nueva valoración sobre un vendedor a la base de datos local
     * @param payload Objeto adaptado al controlador del Backend con puntuacion, comentario y transaccionId
     */
    guardarValoracionUsuario(payload: {
        vendedor_id: number;     // Se mantiene para construir la URL del endpoint
        puntuacion: number;
        comentario: string;
        transaccionId: number;   // Añadido para que coincida con el payload del componente
    }): Observable<{ success: boolean; message: string; valoracion_id?: number }> {

        // Extraes puntuacion, comentario y transaccionId para el cuerpo (body) de la petición
        const { puntuacion, comentario, transaccionId } = payload;

        return this.http.post<{ success: boolean; message: string; valoracion_id?: number }>(
            `${this.apiUrl}/${payload.vendedor_id}/valoraciones`,
            { puntuacion, comentario, transaccionId }
        );
    }
}