import { Component } from '@angular/core';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { AdminHeaderComponent } from '../../../shared/headers/admin-header/admin-header.component';
import { AsideComponent } from '../../../shared/aside/aside.component';

@Component({
  selector: 'app-admin-layout',
  imports: [AdminDashboardComponent,AdminHeaderComponent,AsideComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {

  
}
