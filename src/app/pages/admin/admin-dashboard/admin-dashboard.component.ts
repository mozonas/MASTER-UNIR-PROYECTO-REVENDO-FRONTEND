import { Component } from '@angular/core';
import { MetricCardsComponent } from '../utiles/metric-cards/metric-cards.component';
import { MonthChartComponent } from '../utiles/month-chart/month-chart.component';
import { RecentActivityComponent } from '../utiles/recent-activity/recent-activity.component';
import { MainChartComponent } from '../utiles/main-chart/main-chart.component';


@Component({
  selector: 'app-admin-dashboard',
  imports: [ MainChartComponent, MetricCardsComponent, MonthChartComponent, RecentActivityComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent {

   
  

  

 
}
