import { Component, inject, signal } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ModerationService } from '../../../services/moderation.service';

@Component({
  selector: 'app-metric-cards',
  imports: [],
  templateUrl: './metric-cards.component.html',
  styleUrl: './metric-cards.component.css',
})
export class MetricCardsComponent {
 //Traer del servicio 
 private productServices = inject (ProductService)
 private moderationServices = inject (ModerationService)


 ngOnInit(){
  this.paintPubCard();
  this.loadBadges();
 }

 // Metric card comparativa publicaciones //
  newArticles = signal(0);
  articlesDiff = signal(0);
  lastMonth = signal(0);

 paintPubCard(){
  // Publicados mes actual
    this.productServices.getPubThisMonth().subscribe(res=>{
      this.newArticles.set (res.total); //obtengo total del método
      this.calculateDiff();
    });
    //Publicados último mes
    this.productServices.getPubLastMonth().subscribe (res=>{
      this.lastMonth.set (res.total);
      this.calculateDiff();
    });
  }
  calculateDiff(){
    const last = this.lastMonth();
    const current = this.newArticles();
    if (last === 0){            // si hay 0 articulos la diferencia no ro
      this.articlesDiff.set(100);
      return;
    }
    // redondeo y buscar porcentaje
    const diff = Math.round(((current - last) / last) * 100);
    this.articlesDiff.set(diff);
  }

  

// Traer del servicio los usuarios registrados el último mes
  newUsers = 18;
  usersDiff = -8; 


// Get articulos reportados
  reportedArticles = signal(0);
 
  loadBadges() {
    this.moderationServices.getBadgesCounters().subscribe(res => {
      this.reportedArticles.set(res.pendingArticlesCount);
    });
  }


// Traer usuarios que hayan tenido algun movimiento compra/venta
  activeUsers = 87;           
  activeUsersDiff = 5;  

}
