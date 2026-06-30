import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BadgesResponse, ArticleInReview, ArticleReport, ChatReport } from '../interfaces/moderation.interface';

@Injectable({ providedIn: 'root' })
export class ModerationService {

    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api';

    getBadgesCounters(): Observable<BadgesResponse> {
        return this.http.get<BadgesResponse>(`${this.apiUrl}/reports/badges-counters`);
    }

    reportArticle(articleId: number, motivo: string, reportType: number, usuarioId: number): Observable<{ message: string; reporteId: number }> {
        return this.http.post<{ message: string; reporteId: number }>(
            `${this.apiUrl}/reports/report-article/${articleId}`,
            { motivo, reportType, usuarioId }
        );
    }

    getArticlesInReview(): Observable<ArticleInReview[]> {
        return this.http.get<ArticleInReview[]>(`${this.apiUrl}/reports/articles-in-review`);
    }

    resolveReport(reporteId: number, accion: 'aprobar' | 'descartar'): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(
            `${this.apiUrl}/reports/resolve/${reporteId}`,
            { accion }
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

    /**
     * Función que pide a la API los tipos de reporte
     * @returns 
     */
    getReportTypes() {
        return this.http.get(
            `${this.apiUrl}/reports/types`
        );
    }

    enviarNotificacion(reporteId: number, usuarioId: number, articuloId: number, contenido: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/reports/chats/notificar/${reporteId}`, {
            contenido,
            usuarios_id: usuarioId,
            articulos_id: articuloId
        });
    }

    // Reportar usuario desde el chat
    reportarUsuarioChat(motivo: string, usuariosId: number, articulosId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/reports/chats/reportar-usuario`, {
            motivo,
            usuarios_id: usuariosId,
            articulos_id: articulosId
        });
    }

    resolveReportChat(reporteId: number, accion: 'archivar' | 'bloquear'): Observable<any> {
        return this.http.put(`${this.apiUrl}/reports/chats/resolve/${reporteId}`, { accion });
    }
}