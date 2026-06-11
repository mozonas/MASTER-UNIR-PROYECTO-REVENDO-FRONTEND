import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { AdminNavMenu } from '../../../shared/admin-nav-menu/admin-nav-menu';
import { AdminHeaderComponent } from '../../../shared/headers/admin-header/admin-header.component';

@Component({
  selector: 'app-admin-layout',
  imports: [
    RouterOutlet, 
    FooterComponent,
    AdminHeaderComponent,
    AdminNavMenu
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {}
