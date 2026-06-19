import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, Input, input, signal } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-detail-seller',
  imports: [CommonModule],
  templateUrl: './detail-seller.html',
  styleUrl: './detail-seller.css',
})

export class DetailSeller {
  @Input() sellerId!: number;

  private cdr = inject(ChangeDetectorRef);
  totalValoraciones: number = 0;
  ratingMedia: number = 0;
  totalVendidos: number = 0;
  listaValoraciones: any[] = [];
  isLoaded: boolean = false;
  sellerStats = signal<any | null>(null);
  private userService = inject(UserService);


  ngOnInit() {
    // Traemos de forma síncrona/paralela las estadísticas del backend
    this.cargarEstadisticasReales(this.sellerId);
  }


  // Método encargado de mapear de forma segura el JSON devuelto por tu backend
  private cargarEstadisticasReales(userId: number): void {
    this.userService.getEstadisticasUsuario(userId).subscribe({
      next: (stats) => {
        console.log('Estadísticas reales recibidas de la BD:', stats);
        if (stats) {
          this.totalVendidos = stats.total_vendidos;
          this.totalValoraciones = stats.total_valoraciones;
          this.ratingMedia = Number(stats.rating_media) || 0;
        }

        // Ahora que tenemos las estadísticas reales, cargamos también las valoraciones reales para esa ID de usuario
        this.userService.getValoracionesUsuario(userId).subscribe({
          next: (reviews) => {
            this.listaValoraciones = reviews || [];
            this.isLoaded = true;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error en la petición HTTP al recargar valoraciones:', err);
            this.isLoaded = true;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Error en la petición HTTP al recargar estadísticas:', err);
        this.isLoaded = true;
        this.cdr.detectChanges();
      }
    });
  }

  // Helper rápido para generar el array de estrellas en el HTML
  get estrellas() {
    const estrellasArray = [];

    for (let i = 1; i <= 5; i++) {
      // Calculamos la diferencia entre la nota media y la estrella actual
      const diferencia = this.ratingMedia - (i - 1);
      // Estrella completa
      if (diferencia >= 0.75) estrellasArray.push('fa-star');
      // Media estrella
      else if (diferencia >= 0.25) estrellasArray.push('fa-star-half');
      // Estrella vacía
      else estrellasArray.push('fa-star-o');
    }
    return estrellasArray;
  }
}