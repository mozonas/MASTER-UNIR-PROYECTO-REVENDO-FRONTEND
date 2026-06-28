
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModerationService } from '../../../../services/moderation.service';
import { ChatReport } from '../../../../interfaces/moderation.interface';
import { ChatsHistoryTableComponent } from '../chats-history-table/chats-history-table.component';
import { ChatsPendingTableComponent } from '../chats-pending-table/chats-pending-table.component';
//mog 280626 importamos authservice parala lógica de navegación admin/moderator
import { AuthService } from '../../../../services/auth.service';


@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [CommonModule, ChatsHistoryTableComponent, ChatsPendingTableComponent],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.css',
})
export class ChatsListComponent implements OnInit {
  private moderationService = inject(ModerationService);
  private router = inject(Router);
  //mog 280626 inyectamos
  private auth = inject(AuthService);

  pendingChats = signal<ChatReport[]>([]);
  chatsHistory = signal<ChatReport[]>([]);
  //creamos la contante de navegacion admin/moderador
  private getBasePath(): string {
    return this.auth.getUserRole() === 'ADMIN'
      ? '/admin/moderacion'
      : '/moderation';
  }


  ngOnInit(): void {
    this.loadChatsData();
  }

  loadChatsData(): void {

    this.moderationService.getPendingChats().subscribe({
      next: (chats) => this.pendingChats.set(chats),
      error: (err) => console.error(err)
    });

    this.moderationService.getChatHistory().subscribe({
      next: (history) => this.chatsHistory.set(history),
      error: (err) => console.error(err)
    });
  }

  /* goToDetail(reportId: number): void {
    this.router.navigate(['/moderation/chat/detalle', reportId]);
  } */
  // mog 280626 rehacemos el método
    goToDetail(reportId: number): void {
      const base = this.getBasePath();
      this.router.navigate([base + '/chat/detalle', reportId]);
    }


/*   volverAlPanel(): void {
  this.router.navigate(['/moderation/panel']);
  } */
    //mog  el método para usar auth
    volverAlPanel(): void {
      const base = this.getBasePath();
      this.router.navigate([base + '/panel']);
    }

}


