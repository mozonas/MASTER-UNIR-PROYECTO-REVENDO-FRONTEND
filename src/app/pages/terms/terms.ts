import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; // <-- Añadido Location aquí

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terms.html',
  styleUrl: './terms.css'
})
export class TermsComponent {
  // Formateo premium (Ej: "11 de junio de 2026") en lugar del formato numérico simple
  currentDate: string = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  private location = inject(Location); // <-- Inyectamos el servicio

  /**
   * Dispara la acción de impresión nativa del navegador.
   * Ideal para que el usuario pueda guardar los términos en PDF.
   */
  printDocument(): void {
    window.print();
  }

  onBack(): void {
    this.location.back(); // Now it works!
  }
}