import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definimos la interfaz idéntica al modelo real de tu base de datos
export interface Usuario {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
    usuario: string;
    foto: string | null;
    perfil: 'USUARIO' | 'MODERADOR' | 'ADMIN';
    fecha_nacimiento: string | null;
    created_at: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    // Reemplaza esta URL por la de tu servidor Node.js (ej: Express)
    private apiUrl = 'http://localhost:3000/api/usuarios';

    /**
     * Obtiene el perfil de un usuario específico por su ID
     */
    getPerfilUsuario(id: number): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.apiUrl}/por-id/${id}`);
    }

    updatePerfilUsuario(id: number, datos: Partial<Usuario>): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, datos);
    }
}