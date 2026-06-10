import { Component } from '@angular/core';

@Component({
  selector: 'app-metric-cards',
  imports: [],
  templateUrl: './metric-cards.component.html',
  styleUrl: './metric-cards.component.css',
})
export class MetricCardsComponent {

  newArticles = 42;
  articlesDiff = 12; // 

  newUsers = 18;
  usersDiff = -8; 

  reportedArticles = 7;

  activeUsers = 87;           
  activeUsersDiff = 5;  

}
