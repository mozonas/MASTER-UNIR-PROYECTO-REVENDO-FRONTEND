import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Aseguramos la importación completa

@Component({
  selector: 'app-welcome-component',
  standalone: true, // Asegúrate de tener esto si estás en Angular 14-18+
  imports: [RouterModule], // ¡CRÍTICO!: Añadir aquí para que el enrutador funcione sin problemas
  templateUrl: './welcome-component.html',
  styleUrl: './welcome-component.css',
})
export class WelcomeComponent {
  constructor(private router: Router) {}

  login() {
    this.router.navigate(['/login']);
  }

  signin() {
    this.router.navigate(['/signup']);
  }
}