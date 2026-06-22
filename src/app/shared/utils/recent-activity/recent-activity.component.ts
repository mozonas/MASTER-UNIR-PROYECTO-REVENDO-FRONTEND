import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-recent-activity',
  imports: [DatePipe],
  templateUrl: './recent-activity.component.html',
  styleUrl: './recent-activity.component.css',
})
export class RecentActivityComponent {

  // servicio: usuarios nuevos, articulos nuevos, reportes

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

}
