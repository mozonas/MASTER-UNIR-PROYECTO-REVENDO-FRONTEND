import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderMenuComponent } from "../../shared/headers/header-menu/header-menu.component";
import { FooterComponent } from "../../shared/footer/footer.component";

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, HeaderMenuComponent, FooterComponent],
  templateUrl: './terms.html',
  styleUrls: ['./terms.css']
})
export class TermsComponent {
  currentDate = new Date().toLocaleDateString();
}