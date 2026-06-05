import { Component } from '@angular/core';
import { AdminHeaderComponent } from '../../../shared/headers/admin-header/admin-header.component';
import { AsideComponent } from '../../../shared/aside/aside.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet,AdminHeaderComponent,AsideComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {

  
}
