import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BadgesResponse } from '../interfaces/moderation.interface';

@Injectable({ providedIn: 'root' })
export class ModerationService {
    
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

    // Traer contadores de artículos y chats pendientes al panel principal
    getBadgesCounters(): Observable<BadgesResponse> {
        return this.http.get<BadgesResponse>(
            `${this.apiUrl}/moderation/badges-counters`
        );
    }
}