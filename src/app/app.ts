import { Component, inject, OnInit, DestroyRef, signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from './services/auth.service';

import { FooterComponent } from "./shared/footer/footer.component";
import { HeaderMenuComponent } from "./shared/headers/header-menu/header-menu.component";
import { AdminNavMenu } from "./shared/admin-nav-menu/admin-nav-menu";

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  imports: [RouterOutlet, FooterComponent, HeaderMenuComponent, AdminNavMenu]
})
export class App implements OnInit {
  protected readonly title = signal('MASTER-UNIR-PROYECTO-REVENDO-FRONTEND');
  protected authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  // Variable local que usaremos en el HTML
  currentUserRole: string | null = null;

  ngOnInit() {
    // 1. Evaluamos el rol al cargar la app por primera vez
    this.updateRole();

    // 2. Escuchamos cada vez que termine una navegación con éxito
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef) // Evita fugas de memoria
    ).subscribe(() => {
      this.updateRole();
    });
  }

  private updateRole() {
    this.currentUserRole = this.authService.getUserRole();
  }
}
