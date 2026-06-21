import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Activity } from '../../../interfaces/activity.interface';
import { ActivityService } from '../../../services/activity.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-activity',
  standalone:true,
  imports: [DatePipe],
  templateUrl: './admin-activity.component.html',
  styleUrl: './admin-activity.component.css',
})
export class AdminActivityComponent {
  
    private route = inject (ActivatedRoute)
    private activityServices = inject (ActivityService)
    private cdr = inject(ChangeDetectorRef);
  
  activity: Activity[]=[]
  loading = true;

 ngOnInit(): void {
 
    this.route.paramMap.subscribe(params => {
      const range = params.get('range') as 'daily' | 'weekly' | 'monthly';
      if (range) {
      this.loadActivity(range);
      }
    });
  }

  loadActivity(range: 'daily' | 'weekly' | 'monthly') {
    this.loading = true;

    this.activityServices.getActivity(range).subscribe({next:data => {
     
      this.activity = data;
      this.loading = false;
       this.cdr.detectChanges(); // pinta el contenido en el primer click
      },
      error: (err) => {
        this.loading = false;
        console.error('Error cargando actividades:', err);
      }
    });
   
  }
}
