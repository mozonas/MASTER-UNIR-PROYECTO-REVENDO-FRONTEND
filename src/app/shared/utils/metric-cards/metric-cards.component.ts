import { Component, computed, inject, signal } from '@angular/core';
import { ArticleService } from '../../../services/article.service';
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
 private articleServices = inject (ArticleService)
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
  lastMonth = signal(0);
  articlesDiff = computed(()=>{
    const last = this.lastMonth();
    const current = this.newArticles();
    if (last===0){
      return 100;
    }
    return Math.round (((current-last)/last)*100);
  });

 paintPubCard(){
  this.articleServices.getPubComp().subscribe({
    next:(res)=>{
      this.newArticles.set (res.thisMonth);
      this.lastMonth.set (res.lastMonth);
    },
    error: (err) => console.error('Error al pintar la card:', err)
  })
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
