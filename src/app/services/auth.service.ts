import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Importado para gestionar la respuesta del login

@Injectable({ providedIn: 'root' })
export class AuthService {

    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api';

    // Método para hacer login. Al usar .pipe(map(...)) guardamos el token automáticamente
    login(email: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
            map(response => {
                // Ajusta 'response.token' si tu backend devuelve el token en otra propiedad (ej: response.data.token)
                if (response && response.token) {
                    sessionStorage.setItem('token', response.token);
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
        sessionStorage.removeItem('token');
    }

    // Método para obtener el token del almacenamiento del SessionStorage (Sin console.log molesto)
    getToken(): string | null {
        return sessionStorage.getItem('token');
    }

    // Método para verificar si el usuario está autenticado
    isLogged(): boolean {
        return !!this.getToken();
    }

    // Método para obtener el payload del token decodificado
    getPayload(): any | null {
        const token = this.getToken();
        if (!token) return null;
        return this.decodeToken(token);
    }

    // Método para obtener el rol del usuario desde el payload del token
    getUserRole(): string | null {
        const payload = this.getPayload();
        return payload?.perfil || null;
    }

    // Método para obtener el ID del usuario desde el payload del token
    getUserId(): number | null {
        const payload = this.getPayload();
        return payload?.userId || null;
    }

    // Método para obtener el username desde el payload del token
    getUserName(): string | null {
        const payload = this.getPayload();
        return payload?.username || null;
    }

    // Método privado para decodificar el token JWT
    private decodeToken(token: string): any {
        try {
            const payload = token.split('.')[1];
            // usando decodeURIComponent + atob para soportar caracteres especiales/acentos si los hay
            return JSON.parse(decodeURIComponent(atob(payload).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join('')));
        } catch (e) {
            console.error('Error decodificando token', e);
            return null;
        }
    }
}