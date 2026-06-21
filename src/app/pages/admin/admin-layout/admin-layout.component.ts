import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsideComponent } from "../../../shared/aside/aside.component";

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, AsideComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {


}
