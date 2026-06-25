import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Importado para gestionar la respuesta del login
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api';
    private router = inject(Router)

    // Método para hacer login. Al usar .pipe(map(...)) guardamos el token automáticamente
    login(email: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
            map(response => {
            const token = response?.token;

            // Validar token antes de guardarlo
            if (token && this.decodeToken(token)) {
                sessionStorage.setItem('token', token);
            } else {
                // Token inválido → no guardar nada
                return { error: 'Invalid token' };
            }

            return response;
            })
        );
    }


    // Método para hacer signup
    signup(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/signup`, data);
    }

    // Método para cerrar sesión y limpiar el almacenamiento
    logout(): void {
        sessionStorage.clear();
        this.router.navigate(['/welcome']);
    }


    // Método para obtener el token del almacenamiento del SessionStorage (Sin console.log molesto)
    getToken(): string | null {
        return sessionStorage.getItem('token');
    }

    // Método para verificar si el usuario está autenticado
    isLogged(): boolean {
        const payload = this.getPayload();
        if (!payload) {
            return false;
        }

        // Si el token tiene expiración y ya ha caducado, se invalida sesión local.
        if (typeof payload.exp === 'number') {
            const nowInSeconds = Math.floor(Date.now() / 1000);
            if (payload.exp <= nowInSeconds) {
                sessionStorage.removeItem('token');
                return false;
            }
        }

        return true;
    }


    // Método para obtener el payload del token decodificado
    getPayload(): any | null {
        const token = this.getToken();
        if (!token) return null;

        const payload = this.decodeToken(token);

        if (!payload) {
            // token corrupto → limpiamos
            sessionStorage.removeItem('token');
            return null;
        }

        return payload;
    }


    // Método para obtener el rol del usuario desde el payload del token
    getUserRole(): string | null {
        const payload = this.getPayload();
        return payload?.perfil || null;
    }

    // Método para obtener el ID del usuario desde el payload del token
    getUserId(): number | null {
        const payload = this.getPayload();
        if (!payload || typeof payload.userId !== 'number') {
            return null;
        }
        return payload.userId;
    }


    // Método para obtener el username desde el payload del token
    getUserName(): string | null {
        const payload = this.getPayload();
        if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
            return null;
        }
        return payload.username;
    }


    // Método privado para decodificar el token JWT
    private decodeToken(token: string): any {
        try {
            // Validar estructura mínima: HEADER.PAYLOAD.SIGNATURE
            const parts = token.split('.');
            if (parts.length !== 3) {
            return null;
            }

            const payloadBase64 = parts[1];

            // Base64URL → Base64 (reemplazar caracteres seguros)
            const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');

            // Decodificar
            const json = atob(base64);

            // Parsear JSON
            return JSON.parse(json);

        } catch (e) {
            // Cualquier error → token inválido
            return null;
        }
    }

}