import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModerationService } from '../../../../services/moderation.service'; 
import { ChatReport } from '../../../../interfaces/moderation.interface'; 
import { ChatsHistoryTableComponent } from '../chats-history-table/chats-history-table.component'; 
import { ChatsPendingTableComponent } from '../chats-pending-table/chats-pending-table.component'; 

@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [CommonModule, ChatsHistoryTableComponent, ChatsPendingTableComponent],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.css'
})
export class ChatsListComponent implements OnInit {
  private moderationService = inject(ModerationService);
  private router = inject(Router);

  pendingChats = signal<ChatReport[]>([]);
  chatsHistory = signal<ChatReport[]>([]);

  ngOnInit(): void {
    this.loadChatsData();
  }

  loadChatsData(): void {
    this.moderationService.getPendingChats().subscribe({
      next: (reports) => this.pendingChats.set(reports),
      error: (err) => console.error('Error al cargar chats pendientes:', err)
    });
    
    this.moderationService.getChatHistory().subscribe({
      next: (history) => this.chatsHistory.set(history),
      error: (err) => console.error('Error al cargar historial de chats:', err)
    });
  }

  goToDetail(reportId: number): void {
    const prefix = this.router.url.includes('admin') ? '/admin/moderacion' : '/moderation';
    this.router.navigate([`${prefix}/chat/detalle`, reportId]);
  }

  volverAlPanel(): void {
    const prefix = this.router.url.includes('admin') ? '/admin/moderacion' : '/moderation';
    this.router.navigate([`${prefix}/panel`]);
  }
}




