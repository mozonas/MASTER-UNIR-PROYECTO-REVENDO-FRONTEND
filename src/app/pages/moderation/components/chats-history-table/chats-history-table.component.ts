
import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatReport } from '../../../../interfaces/moderation.interface';
import { ActionButtonComponent } from '../../../../shared/buttons/action-button/action-button.component';
import { PaginationButtonsComponent } from '../../../../shared/buttons/pagination-buttons/pagination-buttons.component';

@Component({
  selector: 'app-chats-history-table',
  standalone: true,
  imports: [CommonModule, ActionButtonComponent, PaginationButtonsComponent],
  templateUrl: './chats-history-table.component.html',
  styleUrl: './chats-history-table.component.css'
})
export class ChatsHistoryTableComponent {
  private rawHistoryData = signal<ChatReport[]>([]);

  @Input({ required: true }) set historyData(value: ChatReport[]) {
    this.rawHistoryData.set(value);
    this.historyPage.set(1);
  }

  @Output() viewDetail = new EventEmitter<number>();

  historyPage = signal<number>(1);
  itemsPerPage = 5;

  paginatedHistory = computed(() => {
    const startIndex = (this.historyPage() - 1) * this.itemsPerPage;
    return this.rawHistoryData().slice(startIndex, startIndex + this.itemsPerPage);
  });

  totalHistoryPages = computed(() => {
    return Math.ceil(this.rawHistoryData().length / this.itemsPerPage) || 1;
  });

  get rawHistoryLength(): number {
    return this.rawHistoryData().length;
  }

  changeHistoryPage(offset: number): void {
    const nextPage = this.historyPage() + offset;
    if (nextPage >= 1 && nextPage <= this.totalHistoryPages()) {
      this.historyPage.set(nextPage);
    }
  }
}


