import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-aside',
  imports: [RouterLink],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
})
export class AsideComponent {
  actividadOpen = false;

  desplegarMenu(){
    this.actividadOpen = !this.actividadOpen;
  }


}
