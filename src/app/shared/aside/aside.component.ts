
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-aside',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
})
export class AsideComponent {
  actividadOpen: boolean = false;

  desplegarMenu():void {
  this.actividadOpen = !this.actividadOpen;
  }



}
