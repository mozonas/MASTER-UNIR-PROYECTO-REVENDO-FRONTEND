import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private http = inject(HttpClient);
  //http://localhost:3000/api/login
  private apiUrl = 'http://localhost:3000/api'; // ajusta si hace falta

    //método para hacer login, recibe email y password, devuelve un Observable con la respuesta del backend
    login(email: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
    }
  
    //método para hacer signup, recibe un objeto con los datos del usuario, devuelve un Observable con la respuesta del backend
    signup(data: any): Observable<any> {
     return this.http.post<any>(`${this.apiUrl}/signup`, data);
    }

    // Método para decodificar el token JWT
    private decodeToken(token: string): any {
        try {
            const payload = token.split('.')[1];
            return JSON.parse(atob(payload));
        } catch (e) {
            console.error('Error decodificando token', e);
            return null;
        }
    }

    // Método para obtener el token del almacenamiento del SessionStorage
    getToken(): string | null {
    console.log(sessionStorage.getItem('token')); 

     return sessionStorage.getItem('token');
        
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
        console.log('PAYLOAD OBTENIDO =>', payload);    
        return payload?.perfil || null;
    }

    // Método para obtener el ID del usuario desde el payload del token
    getUserId(): number | null {
        const payload = this.getPayload();
        return payload?.userId || null;
    }

    // Método para verificar si el usuario está autenticado (tiene un token válido)
    isLogged(): boolean {
        return !!this.getToken();
    }



}