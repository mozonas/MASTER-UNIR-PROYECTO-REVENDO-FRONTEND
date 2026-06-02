import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterLink, AdminDashboardComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {

  actividadOpen = false;

  desplegarMenu(){
    this.actividadOpen = !this.actividadOpen;
  }

}
