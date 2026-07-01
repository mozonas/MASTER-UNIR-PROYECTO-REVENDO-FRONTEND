import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarOption } from '../../../../interfaces/sidebar.interface';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() title: string = 'Menu';
  @Input() options: SidebarOption[] = [];
  @Input() activeTab: string = '';

  @Output() optionSelected = new EventEmitter<string>();

  onOptionClick(optionId: string): void {
    this.optionSelected.emit(optionId);
  }
}


