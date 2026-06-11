import { Component, inject } from '@angular/core';
import  Chart  from 'chart.js/auto';
import { TransactionsServices } from '../../../../services/transactions.service';

@Component({
  selector: 'app-month-chart',
  imports: [],
  templateUrl: './month-chart.component.html',
  styleUrl: './month-chart.component.css',
})
export class MonthChartComponent {
  // llamada servicio ventas mes
  private transaction = inject (TransactionsServices)

  // cargo con el mes actual
  ngOnInit (){
    const mesActual = new Date().getMonth() +1;
    this.generarGraficaVentasMes(mesActual);
  }

  generarGraficaVentasMes(month:number) {
    // array de ventas diarias 30 dias
      this.transaction.getVentasMensuales(month).subscribe (data =>{
      this.pintarGrafica (data.ventas);
    })
  }
    
  pintarGrafica (ventas:number[]){
    // Últimos 30 días
      const dias = [];
        for (let i = 0; i < 30; i++) {
         dias.push(`Día ${i + 1}`);
        }
  
      new Chart('ventasMesChart', {
        type: 'bar',
        data: {
          labels: dias,
          datasets: [
            {
              label: 'Artículos vendidos',
              data: ventas,
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

  



