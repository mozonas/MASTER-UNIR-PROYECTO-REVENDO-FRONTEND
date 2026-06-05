import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    direccion: string;
    descripcion: string;
}

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

    updatePerfilUsuario(id: number, datos: Partial<Usuario>): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, datos);
    }
}