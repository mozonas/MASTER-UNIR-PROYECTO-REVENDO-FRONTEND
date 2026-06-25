
import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleReport } from '../../../../interfaces/moderation.interface';
// import { ActionButtonComponent } from '../../../../shared/buttons/action-button/action-button.component';
import { PaginationButtonsComponent } from '../../../../shared/buttons/pagination-buttons/pagination-buttons.component';

@Component({
  selector: 'app-articles-history-table',
  standalone: true,
  imports: [CommonModule, PaginationButtonsComponent],
  templateUrl: './articles-history-table.component.html',
  styleUrl: './articles-history-table.component.css'
})
export class ArticlesHistoryTableComponent {
  private rawHistoryData = signal<ArticleReport[]>([]);

  @Input({ required: true }) set historyData(value: ArticleReport[]) {
    this.rawHistoryData.set(value);
    this.historyPage.set(1); 
  }

  // @Output() viewDetail = new EventEmitter<number>();

  historyPage = signal<number>(1);
  itemsPerPage = 5;

  paginatedHistory = computed(() => {
    const start = (this.historyPage() - 1) * this.itemsPerPage;
    return this.rawHistoryData().slice(start, start + this.itemsPerPage);
  });

  totalHistoryPages = computed(() => Math.ceil(this.rawHistoryData().length / this.itemsPerPage) || 1);

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



