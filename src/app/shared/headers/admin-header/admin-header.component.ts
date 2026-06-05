import { Component,inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-header',
  imports: [],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css',
})
export class AdminHeaderComponent {
    
  private authService = inject (AuthService);

  role:string | null = null;
  username:string | null = null;

  ngOnInit(){
    this.role = this.authService.getUserRole();
    this.username = this.authService.getUserName();
  }

}
