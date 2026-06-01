import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import  Chart  from 'chart.js/auto';


@Component({
  selector: 'app-admin-dashboard',
  imports: [DatePipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {

  newArticles = 42;
  articlesDiff = 12; // 

  newUsers = 18;
  usersDiff = -8; 

  reportedArticles = 7;

  activeUsers = 87;           
  activeUsersDiff = 5;   

  ngOnInit() {
    this.generarGraficaVentas();
    this.generarGraficaVentasMes();
  }

  generarGraficaVentas() {
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

  recentActivity = [
  {
    type: 'usuario',
    description: 'Nuevo usuario registrado',
    user: 'Carlos Pérez',
    date: new Date('2026-06-01T10:15:00')
  },
  {
    type: 'articulo',
    description: 'Nuevo artículo publicado: "Bicicleta MTB"',
    user: 'Laura Gómez',
    date: new Date('2026-06-01T09:40:00')
  },
  {
    type: 'reporte',
    description: 'Reporte creado: contenido inapropiado',
    user: 'Usuario anónimo',
    date: new Date('2026-06-01T09:10:00')
  },
  {
    type: 'articulo',
    description: 'Artículo vendido: "Monitor 27 pulgadas"',
    user: 'David Ruiz',
    date: new Date('2026-05-31T20:30:00')
  }
];

 generarGraficaVentasMes() {
    // Últimos 30 días
    const dias = [];
      for (let i = 0; i < 30; i++) {
       dias.push(`Día ${i + 1}`);
      }


    // Datos de ejemplo — cámbialos por los de tu API
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
