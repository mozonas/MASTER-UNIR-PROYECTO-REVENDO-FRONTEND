
import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleReport } from '../../../../interfaces/moderation.interface';
import { ActionButtonComponent } from '../../../../shared/buttons/action-button/action-button.component';
import { PaginationButtonsComponent } from '../../../../shared/buttons/pagination-buttons/pagination-buttons.component';

@Component({
  selector: 'app-articles-pending-table',
  standalone: true,
  imports: [CommonModule, ActionButtonComponent, PaginationButtonsComponent],
  templateUrl: './articles-pending-table.component.html',
  styleUrl: './articles-pending-table.component.css'
})
export class ArticlesPendingTableComponent {
  private rawPendingData = signal<ArticleReport[]>([]);

  @Input({ required: true }) set pendingData(value: ArticleReport[]) {
    this.rawPendingData.set(value);
    this.pendingPage.set(1); 
  }

  @Output() viewDetail = new EventEmitter<number>();

  pendingPage = signal<number>(1);
  itemsPerPage = 5;

  paginatedPending = computed(() => {
    const start = (this.pendingPage() - 1) * this.itemsPerPage;
    return this.rawPendingData().slice(start, start + this.itemsPerPage);
  });

  totalPendingPages = computed(() => Math.ceil(this.rawPendingData().length / this.itemsPerPage) || 1);
  
  get rawPendingLength(): number { 
    return this.rawPendingData().length; 
  }

  changePendingPage(offset: number): void {
    const nextPage = this.pendingPage() + offset;
    if (nextPage >= 1 && nextPage <= this.totalPendingPages()) {
      this.pendingPage.set(nextPage);
    }
  }
}


