import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination-buttons.component.html',
  styleUrl: './pagination-buttons.component.css'
})
export class PaginationButtonsComponent {
  isFirstPage = input.required<boolean>();
  isLastPage = input.required<boolean>();
  pageOffset = output<number>();

  onPageChange(offset: number): void {
    this.pageOffset.emit(offset);
  }
}