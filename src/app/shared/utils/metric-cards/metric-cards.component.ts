import { Component, inject, signal } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ModerationService } from '../../../services/moderation.service';
import { UserService } from '../../../services/user.service';
import { TransactionsServices } from '../../../services/transactions.service';

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
 private userServices = inject (UserService)
 private transactionServices = inject (TransactionsServices)


 ngOnInit(){
  this.paintPubCard();
  this.loadBadges();
  this.loadUserMetrics();
  this.loadActiveUsers();
 }

 //**Metric card comparativa publicaciones del mes actual con el anterior  */ 
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

  
//** Metrica nuevos usuarios. Mostrar diferencia entre ususarios nuevos de este mes respeto al mes pasado */
  
  newUsers = signal (0);
  lastUsers = signal(0);
  usersDiff = signal (0);

  loadUserMetrics() {
    this.userServices.getUserStats().subscribe(res => {
    this.newUsers.set(res.usuariosMesActual);
    this.lastUsers.set(res.usuariosMesAnterior);

    this.calculateUsersDiff();
  });
}

  calculateUsersDiff() {
    const last = this.lastUsers();
    const current = this.newUsers();  

      if (last === 0) {
         this.usersDiff.set(100);
         return;
       }  

       const diff = Math.round(((current - last) / last) * 100);
       this.usersDiff.set(diff);
      };


// Get articulos reportados pendientes de revisar
  reportedArticles = signal(0);
 
  loadBadges() {
    this.moderationServices.getBadgesCounters().subscribe(res => {
      this.reportedArticles.set(res.pendingArticlesCount);
    });
  }


// Traer usuarios que hayan tenido algun transaccion
  activeUsers = signal(0);    
  activeUsersLast = signal(0);       
  activeUsersDiff = signal(0);
  
  loadActiveUsers(){
    this.transactionServices.getActiveUsers().subscribe (res=>{
      this.activeUsers.set(res.mesActual);
      this.activeUsers.set(res.mesAnterior);
      this.calculateActiveDiff()
    })
  }
    calculateActiveDiff(){
      const last = this.activeUsersLast();
      const current = this.activeUsers();

      if (last === 0) {
        this.activeUsersDiff.set(100);
        return;
      }
      const diff = Math.round(((current - last) / last) * 100);
      this.activeUsersDiff.set(diff);
      }
    
    
  

}
