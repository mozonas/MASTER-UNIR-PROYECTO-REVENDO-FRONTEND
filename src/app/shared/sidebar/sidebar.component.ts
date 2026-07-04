import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarOption } from '../../interfaces/sidebar.interface';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() title: string = 'Menu';
  @Input() options: SidebarOption[] = [];
  @Input() activeTab: string = '';
  @Input() isCollapsible: boolean = false;

  @Output() optionSelected = new EventEmitter<string>();

  isExpanded = signal<boolean>(true);

  onOptionClick(optionId: string): void {
    this.optionSelected.emit(optionId);
  }

  toggleMenu(): void {
    this.isExpanded.set(!this.isExpanded());
  }

  trackByOption(_: number, option: SidebarOption) {
    return option.id;
  }
}


