import { Component, effect, inject, signal } from '@angular/core';
import  Chart  from 'chart.js/auto';
import { ProductService } from '../../../services/product.service';


@Component({
  selector: 'app-month-chart',
  imports: [],
  templateUrl: './month-chart.component.html',
  styleUrl: './month-chart.component.css',
})

export class MonthChartComponent {
  // llamada servicio ventas mes
  private productServices= inject (ProductService)
  mes ='';


 ngOnInit(){
      const mesActual = new Date().getMonth() + 1;
      this.cargarVentas(mesActual);
  }

  cargarVentas(month:number) {
    // recoger año actual y obtener el mes y los datos
      const year = new Date().getFullYear();
      this.mes = new Date(year, month - 1).toLocaleString('es-ES', { month: 'long' })
      this.productServices.getVentasMensuales(month).subscribe (data =>{
        //dias al mes segun el año
        const totalDias = new Date (year,month, 0).getDate();

        // agrupo en un array el total de dias del mes con sus posiciones
        const ventas = Array (totalDias).fill (0);

        // recoger ventas totales al dia
        data.forEach (item =>{
          ventas[item.dia -1] = item.total;
        });

        // recorrer y pinta el array de dias
        const dias: string[] = [];
        for (let i = 1; i <= totalDias; i++) {
        dias.push(`Día ${i}`);
        }
        
        this.pintarGrafica (dias, ventas);
    })
  }
    
  pintarGrafica (dias: string [], ventas:number[]){
   
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
             padding: {bottom: 20 }
           },
           scales: {
            x:{
              ticks: {
                autoSkip: false
              }
            },
            y: { 
              beginAtZero: true,
              suggestedMax: Math.max(...ventas) + 1,
              ticks: {stepSize: 1, precision: 0}
            }
          }
        }
      }
    )};
    
  }

  



