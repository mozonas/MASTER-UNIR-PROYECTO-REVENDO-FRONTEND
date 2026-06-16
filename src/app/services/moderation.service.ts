import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArticleReport, ChatReport, BadgesResponse } from '../interfaces/moderation.interface';

@Injectable({ providedIn: 'root' })
export class ModerationService {
    
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

    // Traer contadores de artículos y chats pendientes al panel principal
    getBadgesCounters(): Observable<BadgesResponse> {
        return this.http.get<BadgesResponse>(
            `${this.apiUrl}/reports/badges-counters`
        );
    }

    // Traer reportes de articulos pendientes de revision
    getPendingArticles(): Observable<ArticleReport[]> {
        return this.http.get<ArticleReport[]>(
            `${this.apiUrl}/reports/articles/pending`
        );
    }

    // Traer historial de reportes cerrados
    getArticleHistory(): Observable<ArticleReport[]> {
        return this.http.get<ArticleReport[]>(
            `${this.apiUrl}/reports/articles/history`
        );
    }

    // Traer reportes de chats pendientes de revisión
    getPendingChats(): Observable<ChatReport[]> {
        return this.http.get<ChatReport[]>(
            `${this.apiUrl}/reports/chats/pending`
        );
    }

    // Traer historial de chats moderados
    getChatHistory(): Observable<ChatReport[]> {
        return this.http.get<ChatReport[]>(
            `${this.apiUrl}/reports/chats/history`
        );
    }

    
}