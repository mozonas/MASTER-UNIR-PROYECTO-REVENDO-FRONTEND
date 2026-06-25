import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-privacy',
  standalone: true,
  templateUrl: './privacy.html',
  styleUrl: './privacy.css'
})
export class PrivacyComponent {

  private location = inject(Location);

  currentDate: string = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  onBack(): void {
    this.location.back();
  }
}