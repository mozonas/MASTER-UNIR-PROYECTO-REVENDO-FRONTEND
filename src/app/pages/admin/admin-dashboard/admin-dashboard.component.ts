import { Component } from '@angular/core';
import { MetricCardsComponent } from '../../../shared/utils/metric-cards/metric-cards.component';
import { MonthChartComponent } from '../../../shared/utils/month-chart/month-chart.component';
import { RecentActivityComponent } from '../../../shared/utils/recent-activity/recent-activity.component';
import { MainChartComponent } from '../../../shared/utils/main-chart/main-chart.component';


@Component({
  selector: 'app-admin-dashboard',
  imports: [ MainChartComponent, MetricCardsComponent, MonthChartComponent, RecentActivityComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent {

   
  

  

 
}
