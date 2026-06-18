import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Activity } from '../../../interfaces/activity.interface';
import { ActivityService } from '../../../services/activity.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-activity',
  imports: [RouterOutlet, DatePipe],
  templateUrl: './admin-activity.component.html',
  styleUrl: './admin-activity.component.css',
})
export class AdminActivityComponent {
  
    private route = inject (ActivatedRoute)
    private activityServices = inject (ActivityService)
  
  
  activity: Activity[]=[]
  loading = true;

 ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const range = params.get('range') as 'daily' | 'weekly' | 'monthly';
      this.loadActivity(range);
    });
  }

  loadActivity(range: 'daily' | 'weekly' | 'monthly') {
    this.loading = true;

    this.activityServices.getActivity(range).subscribe(data => {
      this.activity = data;
      this.loading = false;
    });
  }

}
