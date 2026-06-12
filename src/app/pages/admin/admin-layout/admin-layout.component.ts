import { Component } from '@angular/core';
import { AsideComponent } from '../../../shared/aside/aside.component';
import { RouterOutlet } from '@angular/router';
import { HeaderMenuComponent } from '../../../shared/headers/header-menu/header-menu.component';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet,HeaderMenuComponent,AsideComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {

  
}
