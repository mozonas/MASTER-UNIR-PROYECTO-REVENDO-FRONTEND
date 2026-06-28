import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class AboutComponent {
  
  private location = inject(Location); 

  onAction(): void {
    console.log('Usuario interactuando con el CTA del manifiesto de ReVendo.');
  }

  onBack(): void {
    this.location.back();
  }
}