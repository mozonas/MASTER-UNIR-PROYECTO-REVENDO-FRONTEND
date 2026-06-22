import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Activity } from '../../../interfaces/activity.interface';
import { ActivityService } from '../../../services/activity.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-activity',
  imports: [DatePipe],
  templateUrl: './admin-activity.component.html',
  styleUrl: './admin-activity.component.css',
})
export class AdminActivityComponent {
  
  private route = inject (ActivatedRoute)
  private activityServices = inject (ActivityService)
  private cdr = inject(ChangeDetectorRef);
   
  activity: Activity[]=[]
  rangoText: string = 'diaria';

 ngOnInit(){
  // segun parámetro dinámico obtenemos el rango de tiempo
    this.route.paramMap.subscribe(params => {
      const range = params.get('range') as 'daily' | 'weekly' | 'monthly';
      if (range) {
      this.loadActivity(range);
      }
    });
  }

  loadActivity(range: 'daily' | 'weekly' | 'monthly') {
    // regularidad segun el parámetro URL
    const regular ={
      daily:'diaria',
      weekly:'semanal',
      monthly: 'mensual',
    };
    // Asignamos texto dinámico correspondiente
    this.rangoText = regular [range]

    this.activityServices.getActivity(range).subscribe({next:data => {
      this.activity = data;
      this.cdr.detectChanges(); // pinta el contenido en el primer click
      },
      error: (err) => {
        console.error('Error cargando actividades:', err);
      }
    });
   
  }
}
