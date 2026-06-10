import { Component } from '@angular/core';
import { HeaderMenuComponent } from "../../shared/headers/header-menu/header-menu.component";
import { FooterComponent } from "../../shared/footer/footer.component";

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [HeaderMenuComponent, FooterComponent],
  templateUrl: './privacy.html',
  styleUrl: './privacy.css'
})
export class PrivacyComponent {
  currentDate: string = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}