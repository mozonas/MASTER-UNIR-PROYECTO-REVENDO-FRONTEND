import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AsideComponent } from '../../aside/aside.component';
import { HeaderMenuComponent } from '../header-menu/header-menu.component';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';


@Component({
  selector: 'app-header-container',
  standalone:true,
  imports: [AsideComponent, HeaderMenuComponent,AdminHeaderComponent],
  templateUrl: './header-container.component.html',
  styleUrl: './header-container.component.css',
})
export class HeaderContainerComponent {

  private authService = inject (AuthService);
  role: string | null = null;

  ngOnInit (){
    this.role = this.authService.getUserRole();
  }

}
