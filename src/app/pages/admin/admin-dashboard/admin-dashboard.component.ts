import { Component } from '@angular/core';
import { MetricCardsComponent } from '../../../shared/utils/metric-cards/metric-cards.component';
import { MonthChartComponent } from '../../../shared/utils/month-chart/month-chart.component';
import { MainChartComponent } from '../../../shared/utils/main-chart/main-chart.component';


@Component({
  selector: 'app-admin-dashboard',
  standalone:true,
  imports: [ MainChartComponent, MetricCardsComponent, MonthChartComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent {

   
  

  

 
}
