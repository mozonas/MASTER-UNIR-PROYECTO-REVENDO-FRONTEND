import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header-menu',
  imports: [RouterLink],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.css',
})
export class HeaderMenuComponent {
 


  private authService = inject (AuthService);

  role:string | null = null;
  username:string | null = null;

  ngOnInit(){
    this.role = this.authService.getUserRole();
    this.username = this.authService.getUserName();
    console.log('ROL REAL:', this.role);
  }

  
}

