import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-admin-header',
  imports: [],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css',
})
export class AdminHeaderComponent {

  role:string | null;
  name:string | null;
  
  inject authService:AuthService

  ngOnInit(){
    this.role = this.authService.getUserRole();
    this.name = this.authService.getUserName();
  }

}
