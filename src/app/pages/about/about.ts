import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class AboutComponent {

  onAction(): void {
    console.log('Usuario interactuando con el CTA del manifiesto de ReVendo.');
  }
}