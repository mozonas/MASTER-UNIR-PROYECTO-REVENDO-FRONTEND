import { Component, inject } from '@angular/core';
import  Chart  from 'chart.js/auto';
import { TransactionsServices } from '../../../services/transactions.service';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-main-chart',
  imports: [],
  templateUrl: './main-chart.component.html',
  styleUrl: './main-chart.component.css',
})

export class MainChartComponent {
  
// del servicio: articulos vendidos por año
private productServices = inject (ProductService)

ngOnInit(){
  this.comparativaYears()
}

comparativaYears (){
  const year = new Date().getFullYear();
  const lastYear = year -1;
  const mesActual = new Date().getMonth()+1;

  forkJoin({
    actual: this.productServices.getVentasAnuales(year),
    anterior: this.productServices.getVentasAnuales(lastYear) }).subscribe(({ actual, anterior }) => {

    const ventasActual = Array(12).fill(0);
    const ventasAnterior = Array(12).fill(0);

    actual.forEach(item => ventasActual[item.mes - 1] = item.total);
    anterior.forEach(item => ventasAnterior[item.mes - 1] = item.total);

    ventasActual.length = mesActual;
    ventasAnterior.length = mesActual;

    this.pintarGrafica(ventasActual, ventasAnterior, year, lastYear, mesActual);
  })
}

 
// método pintado de gráfica
pintarGrafica ( ventasActual: number [], ventasAnterior: number [], thisYear: number, lastYear:number, mesActual:any){

  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
    .slice(0, mesActual);

  new Chart('ventasAnualesChart', {
        type: 'line',
        data: {
          labels: meses,
          datasets: [
            {
              label: `Ventas ${thisYear}`,
              data: ventasActual,
              borderColor: '#4CAF50',
              backgroundColor: 'rgba(76, 175, 80, 0.3)',
              fill: true,
              tension: 0.3,
              borderWidth: 3,
              pointRadius: 5,
              pointBackgroundColor: '#4CAF50'
            },
            {
              label:`Ventas ${lastYear}`,
              data: ventasAnterior,
              borderColor: '#2196F3',
              backgroundColor: 'rgba(33, 150, 243, 0.2)',
              fill: true,
              tension: 0.3,
              borderWidth: 3,
              pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true }
          },
          scales: {
            x: {
              ticks: {
                  padding: 22
              }
            },
            y: {
              beginAtZero: true
            }
          }
        }
      });
    } 
}




