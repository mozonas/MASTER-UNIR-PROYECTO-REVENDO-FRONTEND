
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import{Activity} from '../interfaces/activity.interface'

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

    private http = inject (HttpClient);
    private apiUrl = 'http://localhost:3000/api/activity';

    // Método genérico para compartir
     getActivity(range: 'daily' | 'weekly' | 'monthly'): Observable<Activity[]> {
       return this.http.get<Activity[]>(`${this.apiUrl}/${range}`);
     }

     getDailyActivity(): Observable<Activity[]> {
       return this.getActivity('daily');
     }

     getWeeklyActivity(): Observable<Activity[]> {
       return this.getActivity('weekly');
     }

     getMonthlyActivity(): Observable<Activity[]> {
       return this.getActivity('monthly');
     }
}