import { Component, inject } from '@angular/core';
import  Chart  from 'chart.js/auto';
import { TransactionsServices } from '../../../services/transactions.service';
import {  firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-main-chart',
  imports: [],
  templateUrl: './main-chart.component.html',
  styleUrl: './main-chart.component.css',
})

export class MainChartComponent {
  
  // del servicio: articulos vendidos por año
  private transaction = inject (TransactionsServices)
  

  ngOnInit() {
    this.generarGraficaVentas();
  }


async generarGraficaVentas (){

  //Obtener años
  const thisYear = new Date().getFullYear()
  const lastYear = thisYear -1;
  
  // Obtengo datos de los dos años
  try{
    const dataActual = await firstValueFrom (this.transaction.getVentasAnuales(thisYear));
    const dataAnterior = await firstValueFrom(this.transaction.getVentasAnuales(lastYear));
  
    // a partir de los datos obtenidos extraigo las ventas mensuales para pintarlas en la gráfica segun año correspondiente
    this.pintarGrafica (dataActual.ventas, dataAnterior.ventas, thisYear, lastYear);
  
  }catch (err){
    console.error (err);
  }

}
// método pintado de gráfica
pintarGrafica ( ventasActual: number [], ventasAnterior: number [],thisYear: number, lastYear:number){

const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun','Jul'];

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




