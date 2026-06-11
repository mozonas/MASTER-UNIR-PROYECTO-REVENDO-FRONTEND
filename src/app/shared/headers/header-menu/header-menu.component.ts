import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-menu',
  imports: [RouterLink],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.css',
})
export class HeaderMenuComponent {
 
 @Input() mostrarMenu: boolean = true;


  
}
