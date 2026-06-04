import { Component } from '@angular/core';
import  Chart  from 'chart.js/auto';

@Component({
  selector: 'app-month-chart',
  imports: [],
  templateUrl: './month-chart.component.html',
  styleUrl: './month-chart.component.css',
})
export class MonthChartComponent {
  // llamada servicio ventas mes
  
  ngOnInit (){
    this.generarGraficaVentasMes()
  }

  generarGraficaVentasMes() {
      // Últimos 30 días
      const dias = [];
        for (let i = 0; i < 30; i++) {
         dias.push(`Día ${i + 1}`);
        }
  
  
      // Datos de ejemplo 
      const ventasMes = [
        3, 5, 2, 7, 4, 6, 8, 5, 9, 4,
        6, 7, 3, 8, 10, 6, 5, 7, 9, 4,
        6, 8, 5, 7, 9, 11, 8, 6, 7, 10
      ];
  
      new Chart('ventasMesChart', {
        type: 'bar',
        data: {
          labels: dias,
          datasets: [
            {
              label: 'Artículos vendidos',
              data: ventasMes,
              backgroundColor: 'rgba(33, 150, 243, 0.5)',
              borderColor: '#2196F3',
              borderWidth: 2,
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
           layout: {
             padding: {
             bottom: 20   // evita que los labels sobresalgan
          }
    },
          scales: {
            
            y: { beginAtZero: true }
          }
        }
      });
    }
  }
  



