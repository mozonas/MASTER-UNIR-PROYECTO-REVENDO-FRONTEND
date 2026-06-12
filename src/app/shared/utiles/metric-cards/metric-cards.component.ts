import { Component } from '@angular/core';

@Component({
  selector: 'app-metric-cards',
  imports: [],
  templateUrl: './metric-cards.component.html',
  styleUrl: './metric-cards.component.css',
})
export class MetricCardsComponent {
 //Traer del servicio articulos vendidos y diferencia con anterior
  newArticles = 42;
  articlesDiff = 12; // 
// Traer del servicio los usuarios registrados el último mes
  newUsers = 18;
  usersDiff = -8; 
// Get articulos reportados
  reportedArticles = 7;
// Traer usuarios que hayan tenido algun movimiento compra/venta
  activeUsers = 87;           
  activeUsersDiff = 5;  

}
