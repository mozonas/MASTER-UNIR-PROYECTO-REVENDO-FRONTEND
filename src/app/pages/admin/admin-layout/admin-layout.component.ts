import { Component } from '@angular/core';
import { AsideComponent } from '../../../shared/aside/aside.component';
import { RouterOutlet } from '@angular/router';
import { HeaderMenuComponent } from '../../../shared/headers/header-menu/header-menu.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone:true,
  imports: [RouterOutlet,HeaderMenuComponent,AsideComponent,CommonModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
  
})
export class AdminLayoutComponent {

  
}
