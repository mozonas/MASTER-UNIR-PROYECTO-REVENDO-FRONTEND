
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModerationService } from '../../../../services/moderation.service';
import { BadgesResponse } from '../../../../interfaces/moderation.interface';
import { ActionButtonComponent } from '../../../../shared/buttons/action-button/action-button.component';
//mog 280626 importamos auth para la lógica de navegacion admin/moderador
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-moderation-dashboard',
  standalone: true,
  imports: [CommonModule, ActionButtonComponent],
  templateUrl: './moderation-dashboard.component.html',
  styleUrl: './moderation-dashboard.component.css'
})
export class ModerationDashboardComponent implements OnInit {
  private moderationService = inject(ModerationService);
  private router = inject(Router);
  private auth = inject(AuthService);

  pendingArticlesCount = signal<number>(0);
  pendingChatsCount = signal<number>(0);
   
  //mog 280626 implementamos la constante que determina si navega a admin o a moderador
    private getBasePath(): string {
    return this.auth.getUserRole() === 'ADMIN'
      ? '/admin/moderacion'
      : '/moderation';
  }

  ngOnInit(): void {
    this.moderationService.getBadgesCounters().subscribe({
      next: (data: BadgesResponse) => {
        this.pendingArticlesCount.set(data.pendingArticlesCount);
        this.pendingChatsCount.set(data.pendingChatsCount);
      },
      error: (err) => {
        console.error('Error al recuperar badges en el panel principal:', err);
        this.pendingArticlesCount.set(0);
        this.pendingChatsCount.set(0);
      }
    });
  }

  /* navigateToSection(sectionId: number): void {
    if (sectionId === 1) {
      this.router.navigate(['/moderation/articulos']);
    } else if (sectionId === 2) {
      this.router.navigate(['/moderation/chat']);
    }
  } */

    //mog 280626 reimplementamos la lógica de esta funcionalidad para que la navegación sea correcta entre admin o moderador
    navigateToSection(sectionId: number): void {
      const base = this.getBasePath();

      if (sectionId === 1) {
        this.router.navigate([base + '/articulos']);
      } else if (sectionId === 2) {
        this.router.navigate([base + '/chat']);
      }
    }
}



