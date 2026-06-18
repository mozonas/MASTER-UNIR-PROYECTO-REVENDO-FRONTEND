import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-action-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-button.component.html',
  styleUrl: './action-button.component.css'
})
export class ActionButtonComponent {

  itemId = input.required<number>();
  actionTriggered = output<number>();

  onClick(event: Event): void {
    event.stopPropagation();
    this.actionTriggered.emit(this.itemId());
  }
}


