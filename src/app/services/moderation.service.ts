import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BadgesResponse, ArticleInReview } from '../interfaces/moderation.interface';

@Injectable({ providedIn: 'root' })
export class ModerationService {

    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api';

    getBadgesCounters(): Observable<BadgesResponse> {
        return this.http.get<BadgesResponse>(`${this.apiUrl}/reports/badges-counters`);
    }

    reportArticle(articleId: number, motivo: string, usuarioId: number): Observable<{ message: string; reporteId: number }> {
        return this.http.post<{ message: string; reporteId: number }>(
            `${this.apiUrl}/reports/report-article/${articleId}`,
            { motivo, usuarioId }
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
}