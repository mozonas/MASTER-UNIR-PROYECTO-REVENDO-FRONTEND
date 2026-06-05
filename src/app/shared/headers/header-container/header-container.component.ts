import { Component } from '@angular/core';

@Component({
  selector: 'app-header-container',
  imports: [],
  templateUrl: './header-container.component.html',
  styleUrl: './header-container.component.css',
})
export class HeaderContainerComponent {

  role: string | null;

  constructor (private authService: Authservice){

  }

  ngOnInit (){
    this.role = this.authService.getUserRole();
  }

}
