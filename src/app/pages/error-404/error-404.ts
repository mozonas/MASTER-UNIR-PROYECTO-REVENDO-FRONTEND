import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-error-404',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './error-404.html',
  styleUrl: './error-404.css',
})
export class Error404Component {

  constructor(private authService: AuthService) {}

  getHomeRoute(): string {
    const role = this.authService.getUserRole();

    if (role === 'ADMIN') return '/admin';
    if (role === 'MODERADOR') return '/moderation/panel';
    return '/home';
  }
}
