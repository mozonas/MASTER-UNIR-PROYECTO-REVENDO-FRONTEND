import { Component } from '@angular/core';
import  Chart  from 'chart.js/auto';

@Component({
  selector: 'app-main-chart',
  imports: [],
  templateUrl: './main-chart.component.html',
  styleUrl: './main-chart.component.css',
})
export class MainChartComponent {

  // del servicio: articulos vendidos este año y el anterior

  ngOnInit() {
    this.generarGraficaVentas();
  }


generarGraficaVentas (){
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May'];
  const ventas = [120, 150, 180, 200, 250];
  const ventasAnterior = [100, 130, 160, 180, 210];

  new Chart('ventasAnualesChart', {
        type: 'line',
        data: {
          labels: meses,
          datasets: [
            {
              label: 'Ventas 2026',
              data: ventas,
              borderColor: '#4CAF50',
              backgroundColor: 'rgba(76, 175, 80, 0.3)',
              fill: true,
              tension: 0.3,
              borderWidth: 3,
              pointRadius: 5,
              pointBackgroundColor: '#4CAF50'
            },
            {
              label: 'Ventas 2025',
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
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  


}


