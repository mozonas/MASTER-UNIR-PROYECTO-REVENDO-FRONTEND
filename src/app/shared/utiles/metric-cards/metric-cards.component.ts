import { Component, inject, signal } from '@angular/core';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-metric-cards',
  imports: [],
  templateUrl: './metric-cards.component.html',
  styleUrl: './metric-cards.component.css',
})
export class MetricCardsComponent {
 //Traer del servicio 
 private productServices = inject (ProductService)

  newArticles = signal(0);
  articlesDiff = signal(0);
  lastMonth = signal(0);

 ngOnInit(){
  this.paintPubCard();
 }

 // Metric card comparativa publicaciones
 paintPubCard(){
    this.productServices.getPubThisMonth().subscribe(res=>{
      this.newArticles.set (res.total);
      this.calculateDiff();
    });
    this.productServices.getPubLastMonth().subscribe (res=>{
      this.lastMonth.set (res.total);
      this.calculateDiff();
    });
  }
  calculateDiff(){
    const last = this.lastMonth();
    const current = this.newArticles();
    if (last === 0){
      this.articlesDiff.set(100);
      return;
    }
    const diff = Math.round(((current - last) / last) * 100);
    this.articlesDiff.set(diff);
  }

  

// Traer del servicio los usuarios registrados el último mes
  newUsers = 18;
  usersDiff = -8; 
// Get articulos reportados
  reportedArticles = 7;
// Traer usuarios que hayan tenido algun movimiento compra/venta
  activeUsers = 87;           
  activeUsersDiff = 5;  

}
